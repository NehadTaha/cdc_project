const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setDefaultNavigationTimeout(120000);
    // Navigate to the login page
    await page.goto("https://cdcmemphremagog.com/wp-login.php");

    // Wait for the login form to load
    await page.waitForSelector("#user_login");

    // Fill in the login form and submit
    await page.type("#user_login", "nehad.m.taha@gmail.com");
    await page.type("#user_pass", "wpmdpis2024!!NT");
    await page.click("#wp-submit");

    // Wait for navigation to complete after login
    await page.waitForNavigation();

    // Navigate to the target page after login
    await page.goto(
      "https://cdcmemphremagog.com/wp-admin/edit.php?post_type=service",
      {
        waitUntil: "domcontentloaded",
      }
    );

    let serviceDetails = [];

    // Loop through all pages
    while (true) {
      // Wait for the services to load
      await page.waitForSelector(".row-title");

      // Extract the service details from the current page HTML
      const currentPageServiceDetails = await page.evaluate(() => {
        const details = [];
        // Select all elements with the class "row-title" which contains the service names
        const titleElements = document.querySelectorAll(".row-title");
        // Iterate over each title element
        titleElements.forEach((titleElement) => {
          // Extract the title
          const title = titleElement.textContent.trim();
          // Extract other details associated with the title
          const row = titleElement.closest("tr");
          const postId = row.getAttribute("id").replace("post-", "");
          const description = row.querySelector(".tags_input").textContent;
          const serviceTargets = Array.from(
            row.querySelectorAll(".taxonomy-service_target a")
          ).map((a) => a.textContent);
          const serviceSectors = Array.from(
            row.querySelectorAll(".taxonomy-service_sector a")
          ).map((a) => a.textContent);
          const datePublished = row
            .querySelector(".date")
            .textContent.trim()
            .split("\n")[0]
            .replace("Publié", "")
            .trim();
          // Push the details into the array
          details.push({
            title,
            postId,
            serviceTargets,
            serviceSectors,
            datePublished,
          });
        });
        return details;
      });

      // Concatenate the current page service details with the overall service details array
      serviceDetails = serviceDetails.concat(currentPageServiceDetails);

      // Check if there is a "Next" button
      const nextButton = await page.$(".next-page");
      if (!nextButton) {
        // If there's no "Next" button, exit the loop
        break;
      }

      // Click on the "Next" button to navigate to the next page
      await nextButton.click();

      // Wait for navigation to complete
      await page.waitForNavigation();
    }

    // Loop through each service detail to extract post text, address, phone number, email, and website URL
    for (const detail of serviceDetails) {
      // Navigate to the individual post page
      await page.goto(
        `https://cdcmemphremagog.com/wp-admin/post.php?post=${detail.postId}&action=edit`,
        {
          waitUntil: "domcontentloaded",
        }
      );

      // Wait for the post editor to load
      await page.waitForSelector("#content");

      // Extract the post text
      const postText = await page.evaluate(() => {
        // Select the post content element
        const contentElement = document.querySelector("#content");
        // Return the text content of the post
        return contentElement.textContent.trim();
      });
      // Wait for the municipality checkboxes to load
      await page.waitForSelector(
        ".acf-field-checkbox[data-name='municipality'] input[type='checkbox']"
      );

      // Extract the checked items for municipalities served
      const checkedItems = await page.evaluate(() => {
        const checkedItemsList = [];
        const checkboxes = document.querySelectorAll(
          ".acf-field-checkbox[data-name='municipality'] input[type='checkbox']:checked"
        );
        checkboxes.forEach((checkbox) => {
          checkedItemsList.push(checkbox.value);
        });
        return checkedItemsList;
      });
      await page.waitForSelector("#sample-permalink a");

      // Extract the permalink
      const permalink = await page.evaluate(() => {
        // Select the permalink anchor element
        const permalinkAnchor = document.querySelector("#sample-permalink a");
        // Return the href attribute of the anchor
        return permalinkAnchor.href;
      });
      // Save the permalink to the service details array
      detail.permalink = permalink;

      // Extract address from the post text
      const addressMatch = postText.match(
        /<h2 class="field-content">Adresse<\/h2>\s*<\/div>\s*([^<]+)/
      );

      // Extract phone number from the post text
      // Extract phone number and extension from the post text
      const phoneNumberMatch = postText.match(
        /(?:\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3,4})[-.\s]?(\d{4})(?:.*?(?:\bext\b|\bx\b)[\s.:]*\s*(\d+))?/i
      );

      // Extract email from the post text
      const emailRegex = /<a.+?href="mailto:([^"]+)"/;
      const emailMatch = postText.match(emailRegex);
      const email = emailMatch ? emailMatch[1] : "";

      // Extract website URL from the post text
      const websiteUrlRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/;
      const websiteUrlMatch = postText.match(websiteUrlRegex);
      const websiteUrl = websiteUrlMatch ? websiteUrlMatch[1] : "";

      // Trim and clean the extracted values
      const address = addressMatch ? addressMatch[1].trim() : "";
      const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1].trim() : "";
      const extension =
        phoneNumberMatch && phoneNumberMatch[3]
          ? ` ext: ${phoneNumberMatch[3]}`
          : "";

      // Combine the phone number and extension
      const formattedPhoneNumber = phoneNumberMatch
        ? phoneNumberMatch[0].trim()
        : "";

      // Add the extracted address, phone number, email, and website URL to the service detail
      detail.adresse = address;
      detail.phoneNumber = formattedPhoneNumber;
      detail.email = email;
      detail.websiteUrl = websiteUrl;

      // Save only the required fields to the service details array
      detail.title = detail.title.trim();
      detail.serviceTargets = detail.serviceTargets.map((target) =>
        target.trim()
      );
      detail.serviceSectors = detail.serviceSectors.map((sector) =>
        sector.trim()
      );
      // Save the checked items for municipalities served to the service detail
      detail.municipalitiesServed = checkedItems;
      console.log(detail);

      // Remove unwanted fields
      delete detail.description;
      delete detail.datePublished;
    }
    // Filter out duplicate website URLs at the service level
    serviceDetails.forEach((service) => {
      service.websiteUrls = [...new Set(service.websiteUrls)];
    });

    // Save the service details as JSON
    fs.writeFileSync(
      "serviceDetailsWithPostText.json",
      JSON.stringify(serviceDetails)
    );

    console.log(
      "Service details with post text extracted and saved as serviceDetailsWithPostText.json:",
      serviceDetails
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
