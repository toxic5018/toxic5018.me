// script.js
// This script handles page initialization, console messages, fetching data from XML files,
// settings functionality (dark mode, background motion, visual effects, system default),
// saving preferences to localStorage, PFP click level bar animation with timing and autosave,
// and settings option description tooltips that follow the cursor.

// Log when the script starts executing
console.log('Script loaded!');

// Custom Console Messages (Keeping the original custom messages)
console.log(
  '%cWelcome to toxic5018.me',
  'font-size: 2em; font-family: Arial, sans-serif;'
);
console.log(
  '%c==========================',
  'font-size: 1.5em; font-weight: bold; color: red; font-family: Arial, sans-serif;'
);
console.log(
  '%cDO NOT REUSE THIS!!',
  'font-size: 1.5em; font-weight: bold; color: red; font-family: Arial, sans-serif;'
);
console.log(
  '%c==========================',
  'font-size: 1.5em; font-weight: bold; color: red; font-family: Arial, sans-serif;'
);

// Wait for the DOM to be fully loaded before executing script logic
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded.'); // Log when the DOM is ready

  // --- Social Links Management from link.xml ---

  // Function to fetch and parse XML links and set button hrefs with retries
  function fetchAndSetLinks(retryCount = 3) {
    // Added retryCount with default
    console.log(`Attempting to fetch link.xml (Attempt ${4 - retryCount})...`); // Log fetch attempt

    fetch('link.xml')
      .then((response) => {
        console.log(`link.xml fetch response status: ${response.status}`); // Log response status
        if (!response.ok) {
          console.error(
            `HTTP error fetching link.xml! Status: ${response.status}`
          ); // Error on bad HTTP status
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('link.xml fetched successfully.'); // Log successful fetch
        return response.text();
      })
      .then((str) => {
        console.log('Attempting to parse link.xml...'); // Log parse attempt
        const parser = new DOMParser();
        let xmlDoc;
        try {
          xmlDoc = parser.parseFromString(str, 'text/xml');
        } catch (parseError) {
          console.error('Exception during link.xml parsing:', parseError);
          throw new Error('link.xml parsing failed due to an exception.'); // Re-throw as a custom error
        }

        // Check for XML parsing errors using parsererror element
        const errorNode = xmlDoc.querySelector('parsererror');
        if (errorNode) {
          console.error(
            'Error parsing link.xml (parsererror element):',
            errorNode.textContent
          ); // Error on parse error
          // The parsererror content can be very helpful for debugging
          throw new Error(
            'link.xml parsing error reported in parsererror element.'
          );
        }

        console.log('link.xml parsed successfully.'); // Log successful parse
        return xmlDoc;
      })
      .then((data) => {
        console.log('Setting social button links...'); // Log link setting process
        const socialButtons = document.querySelectorAll(
          '.social-button[data-link-id]'
        );

        socialButtons.forEach((button) => {
          const linkId = button.dataset.linkId;
          // Query for the URL element within the link with the matching ID
          const linkElement = data.querySelector(`link[id="${linkId}"] url`);

          if (linkElement && linkElement.textContent) {
            button.href = linkElement.textContent; // Set button href
            console.log(
              `Link set successfully for button with ID ${linkId}: ${button.href}`
            ); // Log successful link set
            // Add warning for button click leading to redirection
            button.addEventListener('click', () => {
              console.warn(`Button clicked. Redirecting to: ${button.href}`);
            });
          } else {
            console.error(`Link URL not found in XML for button ID: ${linkId}`); // Error if link not found in XML
            // Keep the click warning for missing links from XML - this is a valid case even if XML loads
            button.addEventListener('click', (event) => {
              event.preventDefault(); // Prevent default navigation for broken links
              console.warn(
                `Button clicked, but link URL not found in XML for ID: ${linkId}.`
              );
            });
          }
        });
        console.log('Social button links processing complete.'); // Log end of link setting
      })
      .catch((error) => {
        console.error(
          `Error fetching or parsing link.xml (Attempt ${4 - retryCount}):`,
          error
        ); // Log error with attempt number

        if (retryCount > 0) {
          const retryDelay = 1000; // 1 second delay before retrying
          console.log(`Retrying fetch for link.xml in ${retryDelay}ms...`); // Log retry
          setTimeout(() => fetchAndSetLinks(retryCount - 1), retryDelay);
        } else {
          console.error('Max retries reached. Failed to fetch link.xml.'); // Log max retries
          // If all retries fail, add the fallback click listener to all buttons
          const socialButtons = document.querySelectorAll(
            '.social-button[data-link-id]'
          );
          socialButtons.forEach((button) => {
            // Ensure href is reset to '#' if fetch failed and add the general failure listener
            button.href = '#';
            // Remove any previously added listeners to avoid duplicates
            // This is a basic attempt, storing listener references is more robust but adds complexity
            // For this case, adding the listener again is likely fine as the fetch won't succeed later.
            const oldListener = button._socialLinkErrorListener; // Check for stored listener
            if (oldListener) {
              button.removeEventListener('click', oldListener);
            }
            const newListener = (event) => {
              event.preventDefault();
              console.warn(
                'Button clicked, but social links failed to load after multiple attempts.'
              );
            };
            button.addEventListener('click', newListener);
            button._socialLinkErrorListener = newListener; // Store listener reference
          });
        }
      });
  }

  // Fetch and set links on page load
  fetchAndSetLinks(); // Call without retryCount initially, default handles it

  // --- Version Information from version.xml ---

  // Function to fetch and display version information with retries
  function fetchAndDisplayVersion(retryCount = 3) {
    // Added retryCount with default
    console.log(
      `Attempting to fetch version.xml (Attempt ${4 - retryCount})...`
    ); // Log fetch attempt

    fetch('version.xml')
      .then((response) => {
        console.log(`version.xml fetch response status: ${response.status}`); // Log response status
        if (!response.ok) {
          console.error(
            `HTTP error fetching version.xml! Status: ${response.status}`
          ); // Error on bad HTTP status
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('version.xml fetched successfully.'); // Log successful fetch
        return response.text();
      })
      .then((str) => {
        console.log('Attempting to parse version.xml...'); // Log parse attempt
        const parser = new DOMParser();
        let xmlDoc;
        try {
          xmlDoc = parser.parseFromString(str, 'text/xml');
        } catch (parseError) {
          console.error('Exception during version.xml parsing:', parseError);
          throw new Error('version.xml parsing failed due to an exception.'); // Re-throw as a custom error
        }

        // Check for XML parsing errors using parsererror element
        const errorNode = xmlDoc.querySelector('parsererror');
        if (errorNode) {
          console.error(
            'Error parsing version.xml (parsererror element):',
            errorNode.textContent
          ); // Error on parse error
          throw new Error(
            'version.xml parsing error reported in parsererror element.'
          );
        }

        console.log('version.xml parsed successfully.'); // Log successful parse
        return xmlDoc;
      })
      .then((data) => {
        console.log('Displaying version information...'); // Log version display process
        const versionElement = data.querySelector('version'); // Query for the version element
        const versionInfoElement = document.querySelector('.version-info'); // Get the HTML element

        if (
          versionElement &&
          versionElement.textContent &&
          versionInfoElement
        ) {
          versionInfoElement.textContent = `Version: ${versionElement.textContent}`; // Update text
          console.log(
            `Version updated successfully: ${versionElement.textContent}`
          ); // Log success
        } else {
          console.warn(
            'Version element not found in version.xml or version info HTML element not found.'
          ); // Warn if elements missing
          if (versionInfoElement) {
            versionInfoElement.textContent = 'Version: N/A'; // Set to N/A if not found
          }
        }
        console.log('Version information processing complete.'); // Log end of process
      })
      .catch((error) => {
        console.error(
          `Error fetching or parsing version.xml (Attempt ${4 - retryCount}):`,
          error
        ); // Log error with attempt number

        if (retryCount > 0) {
          const retryDelay = 1000; // 1 second delay before retrying
          console.log(`Retrying fetch for version.xml in ${retryDelay}ms...`); // Log retry
          setTimeout(() => fetchAndDisplayVersion(retryCount - 1), retryDelay);
        } else {
          console.error('Max retries reached. Failed to fetch version.xml.'); // Log max retries
          const versionInfoElement = document.querySelector('.version-info');
          if (versionInfoElement) {
            versionInfoElement.textContent = 'Version: Error loading'; // Indicate final error on page
          }
        }
      });
  }

  // Initial call to fetch and display version
  fetchAndDisplayVersion();

  // --- PFP Click Level Bar ---

  const profilePicture = document.querySelector('.profile-pic');
  const levelBarContainer = document.querySelector('.level-bar-container');
  const levelText = document.querySelector('.level-bar-container .level-text');
  const clickCounter = document.querySelector(
    '.level-bar-container .click-counter'
  );
  const levelBarFill = document.querySelector(
    '.level-bar-container .level-bar-fill'
  );
  console.log('PFP level bar elements referenced.'); // Log referencing

  let currentLevel = 0;
  let clicksInCurrentLevel = 0;
  const clicksToLevelUp = 10;
  let levelBarTimeout = null; // Variable to hold the timeout ID for hiding the bar

  // Function to save level progress to localStorage
  function saveLevelProgress() {
    try {
      const progress = { level: currentLevel, clicks: clicksInCurrentLevel };
      localStorage.setItem('levelProgress', JSON.stringify(progress));
      console.log('Level progress saved to localStorage.', progress); // Log save
    } catch (e) {
      console.error('Error saving level progress to localStorage:', e); // Error on save failure
    }
  }

  // Function to load level progress from localStorage
  function loadLevelProgress() {
    console.log('Attempting to load level progress from localStorage...'); // Log load attempt
    try {
      const savedProgress = localStorage.getItem('levelProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        // Validate loaded data before applying
        if (
          typeof progress.level === 'number' &&
          typeof progress.clicks === 'number' &&
          progress.clicks >= 0 &&
          progress.clicks <= clicksToLevelUp
        ) {
          currentLevel = progress.level;
          clicksInCurrentLevel = progress.clicks;

          // Update UI immediately with loaded progress
          if (levelText && clickCounter && levelBarFill) {
            levelText.textContent = `Level ${currentLevel}`;
            clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
            const percentage = (clicksInCurrentLevel / clicksToLevelUp) * 100;
            levelBarFill.style.width = `${percentage}%`;
            console.log(
              'Level progress loaded and applied from localStorage.',
              progress
            ); // Log load and apply

            // If there are clicks in the current level, show the bar briefly
            if (clicksInCurrentLevel > 0) {
              levelBarContainer.classList.add('visible');
              console.log(
                'Level bar made visible on load due to existing progress.'
              ); // Log visibility
              resetLevelBarTimer(); // Start the hide timer
            }
          } else {
            console.warn(
              'Level bar UI elements not found during loadLevelProgress (UI update failed).'
            ); // Warn if UI missing
          }
        } else {
          console.warn(
            'Invalid level progress data found in localStorage, starting from Level 0.',
            savedProgress
          ); // Warn about invalid data
          // Reset to default if data is invalid
          currentLevel = 0;
          clicksInCurrentLevel = 0;
          // Ensure UI is reset
          if (levelText && clickCounter && levelBarFill) {
            levelText.textContent = `Level ${currentLevel}`;
            clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
            levelBarFill.style.width = '0%';
          }
        }
      } else {
        console.log(
          'No saved level progress found in localStorage, starting from Level 0.'
        ); // Log no data
        // Ensure UI is at default if no data
        if (levelText && clickCounter && levelBarFill) {
          levelText.textContent = `Level ${currentLevel}`;
          clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
          levelBarFill.style.width = '0%';
        }
      }
    } catch (e) {
      console.error(
        'Error loading or parsing level progress from localStorage:',
        e
      ); // Error on load/parse failure
      console.warn('Resetting level progress due to load/parse error.'); // Warn about reset
      currentLevel = 0;
      clicksInCurrentLevel = 0;
      // Ensure UI is reset if there was an error
      if (levelText && clickCounter && levelBarFill) {
        levelText.textContent = `Level ${currentLevel}`;
        clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
        levelBarFill.style.width = '0%';
      }
    }
    console.log('Level progress loading from localStorage complete.'); // Log end of loading
  }

  // Function to hide the level bar
  function hideLevelBar() {
    if (levelBarContainer) {
      levelBarContainer.classList.remove('visible');
      console.log('Level bar container hidden.'); // Log hidden
    }
  }

  // Function to reset the level bar hide timer
  function resetLevelBarTimer() {
    if (levelBarTimeout) {
      clearTimeout(levelBarTimeout);
      console.log('Level bar hide timer cleared.'); // Log timer cleared
    }
    levelBarTimeout = setTimeout(hideLevelBar, 3000); // Hide after 3 seconds (3000ms)
    console.log('Level bar hide timer set for 3 seconds.'); // Log timer set
  }

  // Load level progress when the DOM is ready
  loadLevelProgress();

  // Add event listener to the profile picture container (or the image itself)
  if (
    profilePicture &&
    levelBarContainer &&
    levelText &&
    clickCounter &&
    levelBarFill
  ) {
    profilePicture.addEventListener('click', () => {
      console.log('Profile picture clicked for level update.'); // Log click

      // Make level bar visible and reset its hide timer
      levelBarContainer.classList.add('visible');
      console.log('Level bar container made visible.'); // Log visibility change
      resetLevelBarTimer(); // Reset timer on every click

      clicksInCurrentLevel++;
      console.log(`PFP clicks in current level: ${clicksInCurrentLevel}`); // Log click count

      if (clickCounter && levelBarFill) {
        clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
        const percentage = (clicksInCurrentLevel / clicksToLevelUp) * 100;
        levelBarFill.style.width = `${percentage}%`;
        console.log(`Level bar fill updated to ${percentage.toFixed(2)}%.`); // Log bar update
      }

      // Autosave progress on every click
      saveLevelProgress();

      if (clicksInCurrentLevel >= clicksToLevelUp) {
        currentLevel++;
        clicksInCurrentLevel = 0; // Reset clicks for the new level
        console.log(`Leveled up! New level: ${currentLevel}`); // Log level up

        if (levelText && clickCounter && levelBarFill) {
          levelText.textContent = `Level ${currentLevel}`;
          // Reset click counter after a slight delay to show 10/10 briefly
          setTimeout(() => {
            clickCounter.textContent = `${clicksInCurrentLevel} clicks of ${clicksToLevelUp} clicks`;
            levelBarFill.style.width = '0%'; // Reset bar fill
            console.log('Level bar reset for new level.'); // Log reset
            // Save the leveled-up state (level++, clicks=0) after the visual reset delay
            saveLevelProgress();
          }, 500); // Delay matches bar transition
        } else {
          // If UI elements are missing, just update the variables and save
          saveLevelProgress();
        }
      }
      console.log('PFP click event listener added for level bar.'); // Log listener added
    });
  } else {
    console.warn('One or more PFP or level bar elements not found.'); // Warn if elements missing'); // Warn if elements missing'); // Warn if elements missing'); // Warn if elements missing
  }

  // --- Settings UI and LocalStorage Management ---

  // Get references to settings UI elements
  const settingsIcon = document.querySelector('.settings-icon');
  const settingsOverlay = document.querySelector('.settings-overlay');
  const settingsPanel = document.querySelector('.settings-panel');
  const systemDefaultCheckbox = document.getElementById(
    'systemDefaultCheckbox'
  ); // New system default checkbox
  const darkModeCheckbox = document.getElementById('darkModeCheckbox');
  const backgroundMotionCheckbox = document.getElementById(
    'backgroundMotionCheckbox'
  );
  const visualEffectsCheckbox = document.getElementById(
    'visualEffectsCheckbox'
  );
  const body = document.body;
  const settingItems = document.querySelectorAll(
    '.setting-item label[data-description]'
  ); // Select setting items with descriptions
  const tooltip = document.querySelector('.setting-description-tooltip'); // Get the tooltip element

  // Media query for system color scheme preference
  const systemThemeMediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  console.log('Settings UI elements and system theme media query referenced.'); // Log referencing elements

  // Function to apply the theme (dark or light)
  function applyTheme(mode) {
    if (mode === 'dark') {
      body.classList.add('dark-mode');
      console.log('Website theme set to Dark Mode.'); // Log theme change
    } else {
      body.classList.remove('dark-mode');
      console.log('Website theme set to Light Mode.'); // Log theme change
    }
  }

  // Function to handle system theme changes
  function handleSystemThemeChange(event) {
    if (systemDefaultCheckbox && systemDefaultCheckbox.checked) {
      // Only react if system default is active
      const newTheme = event.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      console.log(
        `System theme changed to ${newTheme}. Website theme updated.`
      );
    }
  }

  // Function to open the settings panel
  function openSettings() {
    console.log('Opening settings panel.'); // Log opening
    settingsOverlay.classList.add('visible');
    settingsPanel.classList.add('active');
    console.log('Settings panel opened.'); // Log opened
  }

  // Function to close the settings panel
  function closeSettings() {
    console.log('Closing settings panel.'); // Log closing
    settingsOverlay.classList.remove('visible');
    settingsPanel.classList.remove('active');
    console.log('Settings panel closed.'); // Log closed
  }

  // Event listener for settings icon click
  if (settingsIcon) {
    settingsIcon.addEventListener('click', () => {
      console.log('Settings icon clicked.'); // Log icon click
      openSettings();
    });
    console.log('Settings icon event listener added.'); // Log listener added
  } else {
    console.warn('Settings icon element not found.'); // Warn if icon not found
  }

  // Event listener for clicking outside the settings panel to close
  settingsOverlay.addEventListener('click', (event) => {
    // Check if the click target is the overlay itself, not the panel
    if (event.target === settingsOverlay) {
      console.log('Clicked outside settings panel.'); // Log click outside
      closeSettings();
    }
  });
  console.log('Settings overlay event listener added.'); // Log listener added

  // Event listener for System Default checkbox change
  if (systemDefaultCheckbox && darkModeCheckbox) {
    systemDefaultCheckbox.addEventListener('change', () => {
      console.log('System Default checkbox changed.'); // Log change
      if (systemDefaultCheckbox.checked) {
        // Enable system default theme
        darkModeCheckbox.disabled = true; // Disable manual dark mode
        darkModeCheckbox.parentElement.classList.add('disabled'); // Add disabled styling class

        const currentSystemTheme = systemThemeMediaQuery.matches
          ? 'dark'
          : 'light';
        applyTheme(currentSystemTheme);

        // Listen for future system theme changes
        systemThemeMediaQuery.addEventListener(
          'change',
          handleSystemThemeChange
        );

        localStorage.setItem('useSystemDefault', 'enabled'); // Save preference
        console.log(
          'System default theme enabled. Dark Mode option disabled. Preference saved.'
        ); // Log state change
      } else {
        // Disable system default theme
        darkModeCheckbox.disabled = false; // Enable manual dark mode
        darkModeCheckbox.parentElement.classList.remove('disabled'); // Remove disabled styling class

        // Stop listening for system theme changes
        systemThemeMediaQuery.removeEventListener(
          'change',
          handleSystemThemeChange
        );

        // Revert to saved Dark Mode preference or default to light
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
          applyTheme('dark');
          darkModeCheckbox.checked = true;
        } else {
          // 'disabled' or no preference saved
          applyTheme('light'); // Default to light if no explicit dark mode preference
          darkModeCheckbox.checked = false;
        }

        localStorage.setItem('useSystemDefault', 'disabled'); // Save preference
        console.log(
          'System default theme disabled. Dark Mode option enabled. Reverted to saved preference.'
        ); // Log state change
      }
    });
    console.log('System Default checkbox event listener added.'); // Log listener added
  } else {
    console.warn(
      'System Default or Dark Mode checkbox element not found. System default functionality may not work.'
    ); // Warn if elements missing
  }

  // Event listener for Dark Mode checkbox change (only active if system default is NOT checked)
  if (darkModeCheckbox && systemDefaultCheckbox) {
    darkModeCheckbox.addEventListener('change', () => {
      // Only allow manual dark mode change if system default is not enabled
      if (!systemDefaultCheckbox.checked) {
        console.log('Dark Mode checkbox changed (manual).'); // Log checkbox change
        if (darkModeCheckbox.checked) {
          applyTheme('dark');
          localStorage.setItem('darkMode', 'enabled'); // Save preference
          console.log(
            'Dark mode enabled (manual). Preference saved to localStorage.'
          ); // Log enabled and saved
        } else {
          applyTheme('light');
          localStorage.setItem('darkMode', 'disabled'); // Save preference
          console.log(
            'Dark mode disabled (manual). Preference saved to localStorage.'
          ); // Log disabled and saved'); // Log disabled and saved
        }
      } else {
        // If system default is checked, uncheck the dark mode box (it should be disabled anyway)
        darkModeCheckbox.checked = false;
        console.log(
          'Attempted to change Dark Mode checkbox while System Default is enabled. Action blocked.'
        ); // Log blocked action
      }
    });
    console.log('Dark Mode checkbox event listener added.'); // Log listener added
  } else {
    console.warn(
      'Dark Mode or System Default checkbox element not found. Dark mode functionality may not work as intended.'
    ); // Warn if elements missing'); // Warn if elements missing
  }

  // Event listener for Background Motion checkbox change
  if (backgroundMotionCheckbox) {
    backgroundMotionCheckbox.addEventListener('change', () => {
      console.log('Background Motion checkbox changed.'); // Log checkbox change
      if (backgroundMotionCheckbox.checked) {
        body.classList.add('background-motion-enabled');
        localStorage.setItem('backgroundMotion', 'enabled'); // Save preference
        console.log(
          'Background motion enabled. Preference saved to localStorage.'
        ); // Log enabled and saved'); // Log enabled and saved
      } else {
        body.classList.remove('background-motion-enabled');
        localStorage.setItem('backgroundMotion', 'disabled'); // Save preference
        console.log(
          'Background motion disabled. Preference saved to localStorage.'
        ); // Log disabled and saved'); // Log disabled and saved
      }
      // Add logging to see the class state after change
      console.log(
        'Body classes after background motion change:',
        body.classList.value
      );
    });
    console.log('Background Motion checkbox event listener added.'); // Log listener added
  } else {
    console.warn('Background Motion checkbox element not found.'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing
  }

  // Event listener for Show Visual Effects checkbox change
  if (visualEffectsCheckbox) {
    visualEffectsCheckbox.addEventListener('change', () => {
      console.log('Show Visual Effects checkbox changed.'); // Log checkbox change
      if (!visualEffectsCheckbox.checked) {
        body.classList.add('no-visual-effects');
        localStorage.setItem('visualEffects', 'disabled'); // Save preference
        console.log(
          'Visual effects disabled. Preference saved to localStorage.'
        ); // Log disabled and saved'); // Log disabled and saved
      } else {
        body.classList.remove('no-visual-effects');
        localStorage.setItem('visualEffects', 'enabled'); // Save preference
        console.log(
          'Visual effects enabled. Preference saved to localStorage.'
        ); // Log enabled and saved'); // Log enabled and saved
      }
    });
    console.log('Show Visual Effects checkbox event listener added.'); // Log listener added
  } else {
    console.warn('Show Visual Effects checkbox element not found.'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing'); // Warn if checkbox missing
  }

  // --- Settings Option Description Tooltip (Follows Cursor) ---

  if (settingItems.length > 0 && tooltip) {
    settingItems.forEach((item) => {
      item.addEventListener('mouseover', (event) => {
        const description = item.dataset.description;
        if (description) {
          tooltip.textContent = description;
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
          console.log(`Showing tooltip for: "${description}"`); // Log showing tooltip
        }
      });

      item.addEventListener('mousemove', (event) => {
        // Position the tooltip near the cursor
        // Add some offset to avoid cursor overlap
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Position relative to viewport coordinates (clientX, clientY)
        // Center tooltip horizontally relative to cursor, position above
        tooltip.style.left = `${mouseX}px`;
        tooltip.style.top = `${mouseY - tooltip.offsetHeight - 10}px`; // 10px above cursor
      });

      item.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        console.log('Hiding tooltip.'); // Log hiding tooltip
      });
    });
    console.log('Setting item hover/mousemove listeners added for tooltips.'); // Log listeners added
  } else {
    console.warn(
      'Setting items with descriptions or tooltip element not found.'
    ); // Warn if elements missing'); // Warn if elements missing'); // Warn if elements missing'); // Warn if elements missing'); // Warn if elements missing
  }

  // --- Load Settings from localStorage on Page Load ---
  // Note: Level progress loading is handled in its dedicated section above.

  console.log(
    'Attempting to load settings (System Default, Dark Mode, Background Motion, Visual Effects) from localStorage...'
  ); // Log load attempt

  const savedUseSystemDefault = localStorage.getItem('useSystemDefault');
  const savedDarkMode = localStorage.getItem('darkMode');
  const savedBackgroundMotion = localStorage.getItem('backgroundMotion');
  const savedVisualEffects = localStorage.getItem('visualEffects');

  // Load and apply System Default setting first
  if (systemDefaultCheckbox && darkModeCheckbox) {
    if (savedUseSystemDefault === 'enabled') {
      systemDefaultCheckbox.checked = true;
      darkModeCheckbox.disabled = true;
      darkModeCheckbox.parentElement.classList.add('disabled');

      const currentSystemTheme = systemThemeMediaQuery.matches
        ? 'dark'
        : 'light';
      applyTheme(currentSystemTheme);

      // Listen for future system theme changes
      systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

      console.log('System default theme loaded and applied from localStorage.');
    } else {
      // 'disabled' or no preference saved
      systemDefaultCheckbox.checked = false;
      darkModeCheckbox.disabled = false;
      darkModeCheckbox.parentElement.classList.remove('disabled');

      // Load and apply manual Dark Mode preference
      if (savedDarkMode === 'enabled') {
        applyTheme('dark');
        darkModeCheckbox.checked = true;
        console.log(
          'Manual dark mode preference loaded and applied from localStorage.'
        );
      } else {
        // 'disabled' or no preference saved for dark mode
        applyTheme('light'); // Default to light if no explicit dark mode preference
        darkModeCheckbox.checked = false;
        console.log(
          'Manual dark mode preference disabled or not found, defaulting to light.'
        );
      }
    }
  } else {
    console.warn(
      'System Default or Dark Mode checkbox element not found during settings load.'
    );
  }

  // Load and apply Background Motion setting
  if (backgroundMotionCheckbox) {
    if (savedBackgroundMotion === 'enabled') {
      backgroundMotionCheckbox.checked = true;
      body.classList.add('background-motion-enabled');
      console.log('Background motion loaded and applied from localStorage.');
    } else if (savedBackgroundMotion === 'disabled') {
      backgroundMotionCheckbox.checked = false;
      body.classList.remove('background-motion-enabled');
      console.log('Background motion preference disabled in localStorage.');
    } else {
      console.log(
        'No background motion preference found in localStorage, using default (disabled).'
      );
      backgroundMotionCheckbox.checked = false;
      body.classList.remove('background-motion-enabled');
    }
  } else {
    console.warn(
      'Background Motion checkbox element not found during settings load.'
    );
  }

  // Load and apply Visual Effects setting
  if (visualEffectsCheckbox) {
    // Default is enabled, so only apply 'no-visual-effects' if explicitly disabled in localStorage
    if (savedVisualEffects === 'disabled') {
      visualEffectsCheckbox.checked = false;
      body.classList.add('no-visual-effects');
      console.log(
        'Visual effects disabled loaded and applied from localStorage.'
      );
    } else if (savedVisualEffects === 'enabled') {
      visualEffectsCheckbox.checked = true;
      body.classList.remove('no-visual-effects');
      console.log('Visual effects preference enabled in localStorage.');
    } else {
      console.log(
        'No visual effects preference found in localStorage, using default (enabled).'
      );
      visualEffectsCheckbox.checked = true; // Default state
      body.classList.remove('no-visual-effects');
    }
  } else {
    console.warn(
      'Visual Effects checkbox element not found during settings load.'
    );
  }

  console.log('Settings loading from localStorage complete.');
});
// end of script.js
