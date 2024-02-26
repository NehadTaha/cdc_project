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
    await page.type("#user_login", "UserAccount"); // Replace 'your_username' with your actual username
    await page.type("#user_pass", "UserPassword"); // Replace 'your_password' with your actual password
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
          // Push the details into the array
          details.push({
            title,
            postId,
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

    // Loop through each service detail to extract checked items for municipalities served
    for (const detail of serviceDetails) {
      // Navigate to the individual post page
      await page.goto(
        `https://cdcmemphremagog.com/wp-admin/post.php?post=${detail.postId}&action=edit`,
        {
          waitUntil: "domcontentloaded",
        }
      );

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

      // Save the checked items for municipalities served to the service detail
      detail.municipalitiesServed = checkedItems;
      console.log(detail);
    }

    // Save the list of municipalities served to a JSON file
    // fs.writeFileSync(
    //   "municipalitiesServed.json",
    //   JSON.stringify(municipalitiesServed, null, 2)
    // );

    // Save the service details with checked items for municipalities served to a JSON file
    fs.writeFileSync(
      "serviceDetailsWithMunicipalities.json",
      JSON.stringify(serviceDetails, null, 2)
    );

    console.log(
      "List of municipalities served extracted and saved to municipalitiesServed.json"
    );
    console.log(
      "Service details with municipalities served extracted and saved to serviceDetailsWithMunicipalities.json"
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
})();
