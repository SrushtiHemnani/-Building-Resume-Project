document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const form = document.querySelector("form");

  // Add a submit event listener to the form
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    // Get the form data
    const formData = new FormData(form);

    // Create an empty object to store the form values
    const formValues = {};

    // Iterate over the form data and store the values in the object
    for (let [key, value] of formData.entries()) {
      const nestedKeys = key.split(".");
      const topLevelKey = nestedKeys[0];

      if (nestedKeys.length > 1) {
        // Handle nested data
        if (formValues[topLevelKey] === undefined) {
          formValues[topLevelKey] = {};
        }

        const nestedObject = formValues[topLevelKey];
        const nestedKey = nestedKeys.slice(1);

        let currentObject = nestedObject;
        for (let i = 0; i < nestedKey.length; i++) {
          const currentKey = nestedKey[i];
          if (currentObject[currentKey] === undefined) {
            currentObject[currentKey] = i === nestedKey.length - 1 ? [] : {};
          }
          if (i === nestedKey.length - 1) {
            if (Array.isArray(currentObject[currentKey])) {
              currentObject[currentKey].push(value);
            } else {
              currentObject[currentKey] = [value];
            }
          }
          currentObject = currentObject[currentKey];
        }
      } else if (key === "profile_image") {
        // Get the profile image file
        const file = formData.get("profile_image");
        if (file) {
          // Read the file and store it in the form values object
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            formValues[topLevelKey] = reader.result;

            // Convert the form values object to JSON string
            const jsonData = JSON.stringify(formValues);

            // Store the JSON data in the local storage
            localStorage.setItem("formData", jsonData);

            // Optionally, you can also display a success message or perform other actions

            // Reset the form
            form.reset();
          };
        }
      } else {
        // Handle other form data
        formValues[key] = value;
      }
    }
    window.location.href = "resume_template.html";
  });

  // Add item event handler
  var addButtons = document.querySelectorAll(".add-item");
  addButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      var cloneBox = this.closest(".clone-box");
      var cloneItems = cloneBox.getElementsByClassName("clone-item");
      var lastCloneItem = cloneItems[cloneItems.length - 1];
      var newItem = lastCloneItem.cloneNode(true);

      cloneBox.insertBefore(newItem, this);
    });
  });

  // Remove item event handler
  var removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      var cloneBox = this.closest(".clone-box");
      var cloneItems = cloneBox.getElementsByClassName("clone-item");

      if (cloneItems.length > 1) {
        cloneItems[cloneItems.length - 1].remove();
      }
    });
  });
});
const isEmptyArray = (arr) => {
  return arr.length === 0 || arr.every((element) => element === "");
};

const hideSection = (id, data) => {
  if (isEmptyArray(data)) {
    const selection = document.getElementById(id);
    if (selection) {
      selection.style.display = "none";
      return false;
    }
  }
  return true;
};

// Populate personal information
const populatePersonalInfo = (resumeData) => {
  const avatarImg = document.querySelector(".avatar-img");
  if (resumeData.profile_image.length) {
    avatarImg.src = resumeData.profile_image;
  } else {
    avatarImg.src = "https://www.w3schools.com/w3images/avatar_hat.jpg"; // Default image if no profile image is stored
  }

  document.querySelector(".name").textContent =
    resumeData.firstname + " " + resumeData.lastname;
  //   document.querySelector(".headline").textContent = resumeData.objective;
  document.querySelector(".email").textContent = resumeData.email;
  document.querySelector(".phone").textContent = resumeData.phonenumber;
  document.querySelector(".about-me").textContent = resumeData.aboutme;
  const objectiveText = document.querySelector(".objective");
  objectiveText.textContent = resumeData.objective;
  const locationElement = document.querySelector(".location");
  locationElement.textContent = resumeData.city + ", " + resumeData.country;
};
// Populate skills

const populateSkills = (resumeData) => {
  const skillsContainer = document.querySelector(".skill-list");

  for (let i = 0; i < resumeData.skill["name"].length; i++) {
    const skillItem = document.createElement("div");
    skillItem.classList.add("skill-item");

    const skillName = document.createElement("div");
    skillName.classList.add("skill-name");
    skillName.textContent = resumeData.skill["name"][i];

    const skillLevel = document.createElement("div");
    skillLevel.classList.add("skill-level");

    const levelBar = document.createElement("div");
    levelBar.classList.add("level-bar");
    levelBar.style.width = resumeData.skill["level"][i] * 10 + "%";

    skillLevel.appendChild(levelBar);

    skillItem.appendChild(skillName);
    skillItem.appendChild(skillLevel);
    skillsContainer.appendChild(skillItem);
  }
};
// education data

const populateEducation = (resumeData) => {
  const educationContainer = document.querySelector(".education-container");
  for (let i = 0; i < resumeData.education["university_name"].length; i++) {
    const educationItem = document.createElement("div");
    educationItem.classList.add("education-item");

    const universityName = document.createElement("p");
    universityName.classList.add("education-title");
    universityName.textContent = resumeData.education["university_name"][i];

    const degree = document.createElement("p");
    degree.textContent = resumeData.education["degree"][i];

    const grades = document.createElement("p");
    grades.textContent = "Grades: " + resumeData.education["grades"][i];

    const areaOfField = document.createElement("p");
    areaOfField.textContent =
      "Area of Field: " + resumeData.education["area_of_feild"][i];

    const duration = document.createElement("p");
    duration.textContent =
      "Duration: " +
      resumeData.education["start_date"][i] +
      " to " +
      resumeData.education["end_date"][i];

    const summary = document.createElement("p");
    summary.textContent = resumeData.education["summary"][i];

    const educationDetails = document.createElement("div");
    educationDetails.classList.add("education-details");
    educationDetails.appendChild(degree);
    educationDetails.appendChild(grades);
    educationDetails.appendChild(areaOfField);
    educationDetails.appendChild(duration);
    educationDetails.appendChild(summary);

    educationItem.appendChild(universityName);
    educationItem.appendChild(educationDetails);

    educationContainer.appendChild(educationItem);
  }
};

const populateExperience = (resumeData) => {
  const experienceContainer = document.querySelector(".experience-container");

  for (let i = 0; i < resumeData.work_experience["name"].length; i++) {
    const experienceItem = document.createElement("article");
    experienceItem.classList.add("flex-group");

    const shortDetails = document.createElement("div");
    shortDetails.classList.add("short");

    const companyName = document.createElement("h4");
    companyName.textContent = resumeData.work_experience["name"][i];

    const companyAddress = document.createElement("p");
    companyAddress.textContent = resumeData.work_experience["position"][i];

    const startDate = document.createElement("small");
    startDate.textContent =
      resumeData.work_experience["start_date"][i] +
      " to " +
      resumeData.work_experience["end_date"][i];

    shortDetails.appendChild(companyName);
    shortDetails.appendChild(companyAddress);
    shortDetails.appendChild(document.createElement("hr"));
    shortDetails.appendChild(startDate);

    const fullDetails = document.createElement("div");
    fullDetails.classList.add("full");

    const companyLink = document.createElement("a");
    companyLink.href = "#"; // Replace with the actual link

    const position = document.createElement("p");
    position.classList.add("read");
    position.textContent = resumeData.work_experience["summary"][i];

    fullDetails.appendChild(companyLink);
    fullDetails.appendChild(position);

    experienceItem.appendChild(shortDetails);
    experienceItem.appendChild(fullDetails);

    experienceContainer.appendChild(experienceItem);
  }
};
const populateProject = (resumeData) => {
  const projectsContainer = document.getElementById("projects");

  for (let i = 0; i < resumeData.project["name"].length; i++) {
    const projectItem = document.createElement("article");
    projectItem.classList.add("flex-group");

    const shortDetails = document.createElement("div");
    shortDetails.classList.add("short");

    const projectName = document.createElement("h4");
    const projectLink = document.createElement("a");
    projectLink.href = ""; // Add your URL here
    projectLink.textContent = resumeData.project["name"][i];
    projectName.appendChild(projectLink);

    const projectDates = document.createElement("p");
    const startDate = resumeData.project["start_date"][i];
    const endDate = resumeData.project["end_date"][i];
    projectDates.textContent = `${startDate} - ${endDate}`;

    const projectDescription = document.createElement("p");
    projectDescription.textContent = resumeData.project["description"][i];

    shortDetails.appendChild(projectName);
    shortDetails.appendChild(projectDates);
    // shortDetails.appendChild(projectDescription);

    const fullDetails = document.createElement("div");
    fullDetails.classList.add("full");

    const projectSummary = document.createElement("p");
    projectSummary.classList.add("read");
    projectSummary.textContent = resumeData.project.summary[i];

    fullDetails.appendChild(projectDescription);

    fullDetails.appendChild(projectSummary);
    fullDetails.appendChild(document.createElement("hr"));

    projectItem.appendChild(shortDetails);
    projectItem.appendChild(fullDetails);

    projectsContainer.appendChild(projectItem);
  }
};
const populateCertificate = (resumeData) => {
  const certificatesContainer = document.getElementById("certificates");
  const certificateNames = resumeData.certification["name"];
  const certificateIssuers = resumeData.certification["issuer"];
  const certificateDates = resumeData.certification["date"];
  const certificateURLs = resumeData.certification["url"];
  const certificateSummaries = resumeData.certification["summary"];

  for (let i = 0; i < certificateNames.length; i++) {
    const certificateItem = document.createElement("article");
    certificateItem.classList.add("certificate");

    const certificateName = document.createElement("h4");
    const certificateLink = document.createElement("a");
    certificateLink.href = certificateURLs[i];
    certificateLink.textContent = certificateNames[i];
    certificateName.appendChild(certificateLink);

    const certificateIssuer = document.createElement("p");
    certificateIssuer.textContent = `Issuer: ${certificateIssuers[i]}`;

    const certificateDate = document.createElement("p");
    certificateDate.textContent = `Date: ${certificateDates[i]}`;

    const certificateSummary = document.createElement("p");
    certificateSummary.textContent = certificateSummaries[i];

    certificateItem.appendChild(certificateName);
    certificateItem.appendChild(certificateIssuer);
    certificateItem.appendChild(certificateDate);
    certificateItem.appendChild(certificateSummary);

    certificatesContainer.appendChild(certificateItem);
  }
};

const populateLanguages = (resumeData) => {
  const languagesContainer = document.querySelector(".language-list");

  for (let i = 0; i < resumeData.language["name"].length; i++) {
    const languageItem = document.createElement("div");
    languageItem.classList.add("language-item");

    const languageName = document.createElement("div");
    languageName.classList.add("language-name");
    languageName.textContent = resumeData.language["name"][i];

    const languageLevel = document.createElement("div");
    languageLevel.classList.add("language-level");

    const levelBar = document.createElement("div");
    levelBar.classList.add("level-bar");
    levelBar.style.width = resumeData.language["level"][i] * 10 + "%";

    languageLevel.appendChild(levelBar);

    languageItem.appendChild(languageName);
    languageItem.appendChild(languageLevel);
    languagesContainer.appendChild(languageItem);
  }
};
const populateReference = (resumeData) => {
  const referenceContainer = document.querySelector(".reference-list");

  const referenceName = resumeData.refrence_name;
  const relationship = resumeData.realtionship;
  const referencePhone = resumeData.refrence_phone;
  const referenceEmail = resumeData.refrence_email;
  const referenceSummary = resumeData.refrence_summary;

  const referenceItem = document.createElement("div");
  referenceItem.classList.add("reference-item");

  const referenceNameElement = document.createElement("div");
  referenceNameElement.classList.add("reference-name");
  referenceNameElement.textContent = referenceName;

  const relationshipElement = document.createElement("div");
  relationshipElement.classList.add("relationship");
  relationshipElement.textContent = relationship;

  const referenceContact = document.createElement("div");
  referenceContact.classList.add("reference-contact");

  const referencePhoneElement = document.createElement("div");
  referencePhoneElement.classList.add("reference-phone");
  referencePhoneElement.textContent = "Phone: " + referencePhone;

  const referenceEmailElement = document.createElement("div");
  referenceEmailElement.classList.add("reference-email");
  referenceEmailElement.textContent = "Email: " + referenceEmail;

  const referenceSummaryElement = document.createElement("div");
  referenceSummaryElement.classList.add("reference-summary");
  referenceSummaryElement.textContent = referenceSummary;

  referenceContact.appendChild(referencePhoneElement);
  referenceContact.appendChild(referenceEmailElement);

  referenceItem.appendChild(referenceNameElement);
  referenceItem.appendChild(relationshipElement);
  referenceItem.appendChild(referenceContact);
  referenceItem.appendChild(referenceSummaryElement);

  referenceContainer.appendChild(referenceItem);
};

const populateProfileLink = (resumeData) => {
  const profileLinksContainer = document.querySelector(".profile-list");

  for (let i = 0; i < resumeData.profiles.link.length; i++) {
    const profileItem = document.createElement("li");
    profileItem.classList.add("profile-item");

    const profileLink = document.createElement("a");
    profileLink.classList.add("profile-link");
    profileLink.href = resumeData.profiles["link"][i];
    profileLink.textContent = resumeData.profiles["name"][i];

    profileItem.appendChild(profileLink);
    profileLinksContainer.appendChild(profileItem);
  }
};
function populateResumeData() {
  const resumeData = JSON.parse(localStorage.getItem("formData"));

  // populate personal info
  populatePersonalInfo(resumeData);

  populateCertificate(resumeData);
  populateReference(resumeData);

  // populate skills
  if (hideSection("skills", resumeData.skill["name"]))
    populateSkills(resumeData);

  if (hideSection("education", resumeData.education["university_name"]))
    populateEducation(resumeData);

  if (hideSection("experience", resumeData.work_experience["name"]))
    populateExperience(resumeData);

  if (hideSection("project", resumeData.project["name"]))
    populateProject(resumeData);

  if (hideSection("certification", resumeData.certification["name"]))
    populateCertificate(resumeData);

  if (hideSection("languages", resumeData.language["name"]))
    populateLanguages(resumeData);

  if (hideSection("profiles", resumeData.profiles["link"]))
    populateProfileLink(resumeData);
}
