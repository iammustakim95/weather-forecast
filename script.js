
        // API Configuration
        const API_KEY = "30af867776be46f68dc124948250208";
        let currentLocation = "New York";
        let debounceTimer;
        let userLocationDetected = false;
        let currentWeatherCondition = "Clear";
        let userData = {};
        let backupData = {};
        let currentIsDay = 1;
        
        // DOM Elements
        const sosToggle = document.getElementById('sosToggle');
        const sosPanel = document.getElementById('sosPanel');
        const sosEmergencyPanel = document.getElementById('sosEmergencyPanel');
        const cancelSos = document.getElementById('cancelSos');
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const weatherAnimation = document.getElementById('weatherAnimation');
        const weatherIconMain = document.getElementById('weatherIconMain');
        const weatherIconLarge = document.getElementById('weatherIconLarge');
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchLocation');
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        const detectLocationBtn = document.getElementById('detectLocation');
        const shareLocationBtn = document.getElementById('shareLocation');
        const notification = document.getElementById('weatherNotification');
        const notificationTitle = document.getElementById('notificationTitle');
        const notificationMessage = document.getElementById('notificationMessage');
        const hourlyForecast = document.getElementById('hourlyForecast');
        const weeklyForecast = document.getElementById('weeklyForecast');
        const updateTime = document.getElementById('updateTime');
        const registerBtn = document.getElementById('registerBtn');
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        const backToRegister = document.getElementById('backToRegister');
        const resendOtp = document.getElementById('resendOtp');
        const registeredEmail = document.getElementById('registeredEmail');
        const registrationForm = document.getElementById('registrationForm');
        const otpVerification = document.getElementById('otpVerification');
        const registrationModal = document.getElementById('registrationModal');
        const registerTrigger = document.getElementById('registerTrigger');
        const healthTips = document.getElementById('healthTips');
        const activityTips = document.getElementById('activityTips');
        const travelTips = document.getElementById('travelTips');
        const emergencyLocation = document.getElementById('emergencyLocation');
        const autoBackup = document.getElementById('autoBackup');
        const locationDisplay = document.getElementById('location');
        
        // Weather display elements
         const currentTemp = document.getElementById('currentTemp');
        const weatherDesc = document.getElementById('weatherDesc');
        const feelsLike = document.getElementById('feelsLike');
        const windSpeed = document.getElementById('windSpeed');
        const windDirection = document.getElementById('windDirection');
        const sunrise = document.getElementById('sunrise');
        const humidity = document.getElementById('humidity');
        const pressure = document.getElementById('pressure');
        const airQuality = document.getElementById('airQuality');
        const pollenInfo = document.getElementById('pollenInfo');
        const uvInfo = document.getElementById('uvInfo');
        const carWashInfo = document.getElementById('carWashInfo');
        const workoutInfo = document.getElementById('workoutInfo');
        const trafficInfo = document.getElementById('trafficInfo');
        const tripInfo = document.getElementById('tripInfo');
        const mosquitoInfo = document.getElementById('mosquitoInfo');
        
        // Initialize the app
        function initApp() {
            // Set initial theme based on time
            const hour = new Date().getHours();
            if (hour < 6 || hour > 18) {
                body.classList.add('dark-theme');
                themeToggle.checked = true;
            }
            
            // Set event listeners
            sosToggle.addEventListener('click', toggleSOS);
            cancelSos.addEventListener('click', deactivateSOS);
            themeToggle.addEventListener('change', toggleTheme);
            searchBtn.addEventListener('click', searchWeather);
            searchInput.addEventListener('input', handleSearchInput);
            detectLocationBtn.addEventListener('click', detectLocation);
            shareLocationBtn.addEventListener('click', shareLocation);
            registerBtn.addEventListener('click', registerUser);
            verifyOtpBtn.addEventListener('click', verifyOtp);
            backToRegister.addEventListener('click', showRegistrationForm);
            resendOtp.addEventListener('click', generateOtp);
            registerTrigger && registerTrigger.addEventListener('click', showRegistration);
            autoBackup.addEventListener('change', toggleAutoBackup);
            
            // OTP digit inputs
            const otpDigits = document.querySelectorAll('.otp-digit');
            otpDigits.forEach((digit, index) => {
                digit.addEventListener('input', (e) => {
                    if (e.target.value.length === 1 && index < otpDigits.length - 1) {
                        otpDigits[index + 1].focus();
                    }
                });
                
                digit.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                        otpDigits[index - 1].focus();
                    }
                });
            });
            
            // Close suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target)) {
                    suggestionsContainer.classList.remove('visible');
                }
            });
            
            // Check registration
            checkRegistration();
            
            // Detect location on app load
            detectLocationOnLoad();
        }
        
        // Detect location on app load
        function detectLocationOnLoad() {
            if (navigator.geolocation) {
                locationDisplay.textContent = "Detecting location...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        getLocationName(position.coords.latitude, position.coords.longitude);
                        showNotification('Location Detected', 'Using your current location');
                        userLocationDetected = true;
                    },
                    (error) => {
                        showNotification('Info', 'Using default location');
                        currentLocation = "default";
                        fetchWeather(currentLocation);
                        userLocationDetected = false;
                    }
                );
            } else {
                showNotification('Info', 'Using default location');
                currentLocation = "default";
                fetchWeather(currentLocation);
                userLocationDetected = false;
            }
        }
        
        // Check if user is registered
        function checkRegistration() {
            const savedUser = localStorage.getItem('weatherUser');
            if (!savedUser) {
                showRegistration();
            } else {
                userData = JSON.parse(savedUser);
            }
        }
        

      
        // Toggle auto backup
        function toggleAutoBackup() {
            if (autoBackup.checked) {
                localStorage.setItem('autoBackup', 'true');
                showNotification('Auto Backup', 'Automatic data backup enabled');
            } else {
                localStorage.setItem('autoBackup', 'false');
                showNotification('Auto Backup', 'Automatic data backup disabled');
            }
        }
        
        // Detect user location for weather
        function detectLocation() {
            if (navigator.geolocation) {
                locationDisplay.textContent = "Detecting location...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        getLocationName(position.coords.latitude, position.coords.longitude);
                        showNotification('Location Detected', 'Using your current location');
                        userLocationDetected = true;
                    },
                    (error) => {
                        showNotification('Info', 'Using default location');
                        currentLocation = "New York";
                        fetchWeather(currentLocation);
                        userLocationDetected = false;
                    }
                );
            } else {
                showNotification('Info', 'Using default location');
                currentLocation = "New York";
                fetchWeather(currentLocation);
                userLocationDetected = false;
            }
        }
        
        // Get complete location name from coordinates
        async function getLocationName(lat, lon) {
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`
                );
                
                const data = await response.json();
                if (data && data.location) {
                    const loc = data.location;
                    // Create complete location string
                    let locationStr = loc.name;
                    if (loc.region && loc.region !== loc.name) locationStr += `, ${loc.region}`;
                    locationStr += `, ${loc.country}`;
                    
                    searchInput.value = locationStr;
                    currentLocation = locationStr;
                    fetchWeather(currentLocation);
                }
            } catch (error) {
                console.error("Error getting location name:", error);
                currentLocation = "New York";
                fetchWeather(currentLocation);
            }
        }
        
        // Handle search input with debounce
        function handleSearchInput() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (searchInput.value.length > 2) {
                    fetchLocationSuggestions(searchInput.value);
                } else {
                    suggestionsContainer.classList.remove('visible');
                }
            }, 300);
        }
        
        // Fetch location suggestions
        async function fetchLocationSuggestions(query) {
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
                );
                
                const data = await response.json();
                displaySuggestions(data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            }
        }
        
        // Display location suggestions
        function displaySuggestions(locations) {
            suggestionsContainer.innerHTML = '';
            
            if (!locations || locations.length === 0) {
                suggestionsContainer.innerHTML = '<div class="suggestion-item">No locations found</div>';
                suggestionsContainer.classList.add('visible');
                return;
            }
            
            locations.forEach(location => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item';
                suggestion.innerHTML = `
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <div>${location.name}, ${location.country}</div>
                        <div style="font-size: 12px; opacity: 0.7;">${location.region || ''}</div>
                    </div>
                `;
                
                suggestion.addEventListener('click', () => {
                    // Create complete location string
                    let locationStr = location.name;
                    if (location.region && location.region !== location.name) locationStr += `, ${location.region}`;
                    locationStr += `, ${location.country}`;
                    
                    searchInput.value = locationStr;
                    currentLocation = locationStr;
                    fetchWeather(location.name);
                    suggestionsContainer.classList.remove('visible');
                    userLocationDetected = false;
                });
                
                suggestionsContainer.appendChild(suggestion);
            });
            
            suggestionsContainer.classList.add('visible');
        }
        
        // Fetch weather data
        async function fetchWeather(location) {
            showLoader();
            
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes`
                );
                
                const data = await response.json();
                
                if (!data || data.error) {
                    showNotification('Error', 'Location not found');
                    hideLoader();
                    return;
                }
                
                // Update UI with data
                updateCurrentWeather(data);
                updateHourlyForecast(data);
                updateWeeklyForecast(data);
                updateWeatherAnimation(data.current.condition.text);
                updateWeatherAdvisory(data);
                
                // Update time
                updateTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                
                // Update weather condition for advisory
                currentWeatherCondition = data.current.condition.text;
                currentIsDay = data.current.is_day;
                
                showNotification('Success', `Weather data for ${data.location.name} loaded`);
                
                // Save backup
                if (autoBackup.checked) {
                    backupData = {
                        ...data,
                        backupTimestamp: new Date().toISOString()
                    };
                    localStorage.setItem('weatherBackup', JSON.stringify(backupData));
                }
                
            } catch (error) {
                console.error("Error fetching weather data:", error);
                showNotification('Error', 'Failed to fetch weather data. Using backup if available.');
                loadBackupData();
            }
            
            hideLoader();
        }
        
        // Load backup data
        function loadBackupData() {
            const savedBackup = localStorage.getItem('weatherBackup');
            if (savedBackup) {
                const data = JSON.parse(savedBackup);
                updateCurrentWeather(data);
                updateHourlyForecast(data);
                updateWeeklyForecast(data);
                updateWeatherAnimation(data.current.condition.text);
                updateWeatherAdvisory(data);
                
                showNotification('Info', 'Using backup weather data');
            } else {
                showNotification('Error', 'No backup data available');
            }
        }
        
        // Update current weather display
        function updateCurrentWeather(data) {
            const current = data.current;
            const location = data.location;
            
            currentTemp.textContent = `${Math.round(current.temp_c)}°`;
            weatherDesc.textContent = current.condition.text;
            
            // Update weather icon
            const weatherIcon = getWeatherIcon(current.condition.code, current.is_day);
            weatherIconMain.className = `fas ${weatherIcon}`;
            weatherIconLarge.innerHTML = `<i class="fas ${weatherIcon}"></i>`;
            
            windSpeed.textContent = `${current.wind_kph} km/h`;
            humidity.textContent = `${current.humidity}%`;
            feelsLike.textContent = `${Math.round(current.feelslike_c)}°`;
            
            // Create complete location string
            let locationStr = location.name;
            if (location.region && location.region !== location.name) locationStr += `, ${location.region}`;
            locationStr += `, ${location.country}`;
            locationDisplay.textContent = locationStr;
            
            // Get sunrise/sunset from astronomy data
            if (data.forecast && data.forecast.forecastday.length > 0) {
                const astro = data.forecast.forecastday[0].astro;
                sunrise.textContent = astro.sunrise;
            }
            
            // Update weather animation
            updateWeatherAnimation(current.condition.text);
        }
        
        // Update hourly forecast
        function updateHourlyForecast(data) {
            hourlyForecast.innerHTML = '';
            
            if (!data.forecast || !data.forecast.forecastday.length) return;
            
            const now = new Date();
            const currentHour = now.getHours();
            const todayForecast = data.forecast.forecastday[0].hour;
            
            // Show next 12 hours
            for (let i = 0; i < 12; i++) {
                const hourIndex = (currentHour + i) % 24;
                const hourData = todayForecast[hourIndex];
                
                const hourItem = document.createElement('div');
                hourItem.className = 'hour-item';
                
                const time = new Date(hourData.time);
                const timeString = time.toLocaleTimeString([], { hour: '2-digit' });
                
                hourItem.innerHTML = `
                    <div class="hour-time">${i === 0 ? 'Now' : timeString}</div>
                    <div class="day-weather"><i class="fas ${getWeatherIcon(hourData.condition.code, hourData.is_day)}"></i></div>
                    <div class="hour-temp">${Math.round(hourData.temp_c)}°</div>
                `;
                
                hourlyForecast.appendChild(hourItem);
            }
        }
        
        // Update weekly forecast for all 7 days
        function updateWeeklyForecast(data) {
            weeklyForecast.innerHTML = '';
            
            if (!data.forecast || !data.forecast.forecastday.length) return;
            
            const forecastDays = data.forecast.forecastday;
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            forecastDays.forEach((dayData, index) => {
                const date = new Date(dayData.date);
                const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : days[date.getDay()];
                
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const dateString = `${date.getDate()} ${monthNames[date.getMonth()]}`;
                
                dayCard.innerHTML = `
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${dateString}</div>
                    <div class="day-weather"><i class="fas ${getWeatherIcon(dayData.day.condition.code, 1)}"></i></div>
                    <div class="day-temp">${Math.round(dayData.day.mintemp_c)}° / ${Math.round(dayData.day.maxtemp_c)}°</div>
                    <div class="day-stats">
                        <span><i class="fas fa-wind"></i> ${dayData.day.maxwind_kph}km/h</span>
                        <span><i class="fas fa-tint"></i> ${dayData.day.avghumidity}%</span>
                    </div>
                `; 
                
                // Add alerts for rain or extreme temps
                if (dayData.day.daily_will_it_rain || dayData.day.daily_chance_of_rain > 50) {
                    dayCard.innerHTML += '<div class="alert-icon"><i class="fas fa-cloud-rain"></i></div>';
                } else if (dayData.day.maxtemp_c > 30) {
                    dayCard.innerHTML += '<div class="alert-icon" style="background: var(--warning);"><i class="fas fa-temperature-high"></i></div>';
                } else if (dayData.day.mintemp_c < 0) {
                    dayCard.innerHTML += '<div class="alert-icon" style="background: var(--primary);"><i class="fas fa-snowflake"></i></div>';
                }
                
                weeklyForecast.appendChild(dayCard);
            });
        }
        
        // Update weather advisory based on current condition
        function updateWeatherAdvisory(data) {
            const current = data.current;
            const today = data.forecast.forecastday[0].day;
            
            let healthTipsHTML = '';
            let activityTipsHTML = '';
            let travelTipsHTML = '';
            
            // UV info
            const uvIndex = today.uv;
            let uvText = '';
            if (uvIndex <= 2) uvText = 'Low UV index - minimal protection needed';
            else if (uvIndex <= 5) uvText = 'Moderate UV index - protection recommended';
            else if (uvIndex <= 7) uvText = 'High UV index - protection essential';
            else if (uvIndex <= 10) uvText = 'Very high UV index - extra protection needed';
            else uvText = 'Extreme UV index - avoid sun exposure';
            
            healthTipsHTML += `<li><i class="fas ${uvIndex <= 2 ? 'fa-check-circle' : uvIndex <= 7 ? 'fa-exclamation-triangle' : 'fa-times-circle'}" 
                style="color: ${uvIndex <= 2 ? 'var(--success)' : uvIndex <= 7 ? 'var(--warning)' : 'var(--danger)'};"></i> ${uvText}</li>`;
            
            // Pollen info (simulated)
            const pollenCount = Math.floor(Math.random() * 5); // 0-4
            let pollenText = '';
            if (pollenCount === 0) pollenText = 'Very low pollen count';
            else if (pollenCount === 1) pollenText = 'Low pollen count';
            else if (pollenCount === 2) pollenText = 'Moderate pollen count';
            else if (pollenCount === 3) pollenText = 'High pollen count';
            else pollenText = 'Very high pollen count - allergy warning';
            
            healthTipsHTML += `<li><i class="fas ${pollenCount < 2 ? 'fa-check-circle' : pollenCount < 4 ? 'fa-exclamation-circle' : 'fa-times-circle'}" 
                style="color: ${pollenCount < 2 ? 'var(--success)' : pollenCount < 4 ? 'var(--warning)' : 'var(--danger)'};"></i> ${pollenText}</li>`;
            
            // Workout info
            const temp = current.temp_c;
            let workoutText = '';
            if (temp > 30) {
                workoutText = 'Avoid outdoor workouts - too hot';
            } else if (temp > 25) {
                workoutText = 'Suitable for indoor workouts - hot outside';
            } else if (temp > 15) {
                workoutText = 'Great for outdoor workouts';
            } else if (temp > 5) {
                workoutText = 'Suitable for outdoor workouts - dress warm';
            } else {
                workoutText = 'Avoid outdoor workouts - too cold';
            }
            
            activityTipsHTML += `<li><i class="fas ${temp > 30 || temp <= 5 ? 'fa-times-circle' : temp > 25 ? 'fa-exclamation-circle' : 'fa-check-circle'}" 
                style="color: ${temp > 30 || temp <= 5 ? 'var(--danger)' : temp > 25 ? 'var(--warning)' : 'var(--success)'};"></i> ${workoutText}</li>`;
            
            // Traffic info
            const isRaining = current.precip_mm > 0;
            const isRushHour = (new Date().getHours() >= 7 && new Date().getHours() <= 9) || 
                              (new Date().getHours() >= 16 && new Date().getHours() <= 19);
            let trafficText = '';
            
            if (isRaining && isRushHour) {
                trafficText = 'Poor traffic conditions - rain and rush hour';
            } else if (isRaining) {
                trafficText = 'Moderate traffic conditions - rain expected';
            } else if (isRushHour) {
                trafficText = 'Moderate traffic conditions - rush hour';
            } else {
                trafficText = 'Good traffic conditions';
            }
            
            travelTipsHTML += `<li><i class="fas ${isRaining && isRushHour ? 'fa-times-circle' : isRaining || isRushHour ? 'fa-exclamation-circle' : 'fa-check-circle'}" 
                style="color: ${isRaining && isRushHour ? 'var(--danger)' : isRaining || isRushHour ? 'var(--warning)' : 'var(--success)'};"></i> ${trafficText}</li>`;
            
            healthTips.innerHTML = healthTipsHTML;
            activityTips.innerHTML = activityTipsHTML;
            travelTips.innerHTML = travelTipsHTML;
        }
        
        // Get appropriate weather icon
        function getWeatherIcon(code, isDay) {
            // Simplified version - you can expand this with more codes
            if (code === 1000) return isDay ? 'fa-sun' : 'fa-moon';
            if (code === 1003) return isDay ? 'fa-cloud-sun' : 'fa-cloud-moon';
            if (code === 1006 || code === 1009) return 'fa-cloud';
            if (code >= 1030 && code <= 1135) return 'fa-smog';
            if (code >= 1063 && code <= 1201) return 'fa-cloud-rain';
            if (code >= 1204 && code <= 1237) return 'fa-snowflake';
            if (code >= 1240 && code <= 1264) return 'fa-cloud-showers-heavy';
            if (code >= 1273 && code <= 1282) return 'fa-bolt';
            return 'fa-cloud';
        }
        
        // Update weather animation based on condition
        function updateWeatherAnimation(condition) {
            // Clear existing animations
            weatherAnimation.querySelectorAll('.raindrop, .snowflake, .wind-particle').forEach(el => el.remove());
            
            // Remove any existing sun animation
            const sun = document.getElementById('sunAnimation');
            if (sun) sun.style.display = 'block';
            
            // Add new animations based on weather
            condition = condition.toLowerCase();
            
            if (condition.includes('sunny') || condition.includes('clear')) {
                // Sunny: Keep sun and clouds
                if (condition.includes('partly cloudy')) {
                    // Add extra clouds for partly cloudy
                    for (let i = 0; i < 3; i++) {
                        addCloud(i * 30, 10 + Math.random() * 30);
                    }
                }
            } 
            else if (condition.includes('cloud')) {
                // Cloudy: Add more clouds
                for (let i = 0; i < 5; i++) {
                    addCloud(i * 20, 10 + Math.random() * 40);
                }
                sun.style.display = 'none';
            } 
            else if (condition.includes('rain') || condition.includes('drizzle')) {
                // Rain: Add raindrops
                for (let i = 0; i < 60; i++) {
                    addRaindrop();
                }
                sun.style.display = 'none';
            } 
            else if (condition.includes('snow')) {
                // Snow: Add snowflakes
                for (let i = 0; i < 30; i++) {
                    addSnowflake();
                }
                sun.style.display = 'none';
            } 
            else if (condition.includes('thunder')) {
                // Thunderstorm: Add wind particles and raindrops
                for (let i = 0; i < 40; i++) {
                    addWindParticle();
                }
                for (let i = 0; i < 40; i++) {
                    addRaindrop();
                }
                sun.style.display = 'none';
                
                // Flash effect for thunder
                setInterval(() => {
                    if (Math.random() > 0.97) {
                        document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        setTimeout(() => {
                            document.body.style.backgroundColor = '';
                        }, 100);
                    }
                }, 1000);
            }
        }
        
        // Helper functions for weather animations
        function addCloud(topPercent, leftPercent) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = `${topPercent}%`;
            cloud.style.left = `${leftPercent}%`;
            cloud.style.width = `${80 + Math.random() * 70}px`;
            cloud.style.height = `${30 + Math.random() * 30}px`;
            cloud.style.animation = `cloudFloat ${20 + Math.random() * 20}s infinite linear`;
            cloud.style.animationDelay = `-${Math.random() * 10}s`;
            weatherAnimation.appendChild(cloud);
        }
        
        function addRaindrop() {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random()}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            weatherAnimation.appendChild(drop);
        }
        
        function addSnowflake() {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.innerHTML = '<i class="fas fa-snowflake"></i>';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${5 + Math.random() * 5}s`;
            flake.style.animationDelay = `${Math.random() * 2}s`;
            flake.style.fontSize = `${10 + Math.random() * 15}px`;
            flake.style.opacity = `${0.5 + Math.random() * 0.5}`;
            weatherAnimation.appendChild(flake);
        }
        
        function addWindParticle() {
            const particle = document.createElement('div');
            particle.className = 'wind-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${2 + Math.random() * 3}s`;
            particle.style.animationDelay = `${Math.random() * 3}s`;
            weatherAnimation.appendChild(particle);
        }
        
        // Show notification
        function showNotification(title, message) {
            notificationTitle.textContent = title;
            notificationMessage.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
        
        // Toggle SOS mode
        function toggleSOS() {
            const isActive = sosToggle.classList.toggle('active');
            sosPanel.classList.toggle('active');
            
            if (isActive) {
                sosToggle.innerHTML = '<i class="fas fa-shield-alt"></i> TRAVEL SAFETY MODE: ON';
                sosToggle.style.background = 'var(--success)';
                showNotification('Safety Mode Activated', 'Travel safety features enabled');
            } else {
                sosToggle.innerHTML = '<i class="fas fa-shield-alt"></i> TRAVEL SAFETY MODE: OFF';
                sosToggle.style.background = 'var(--danger)';
            }
        }
        
        // Activate SOS emergency mode
        function activateSOS() {
            sosEmergencyPanel.classList.add('active');
            
            // Simulate SOS progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                sosProgress.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    showNotification('Emergency', 'Emergency services notified');
                }
            }, 100);
        }
        
        // Deactivate SOS emergency mode
        function deactivateSOS() {
            sosEmergencyPanel.classList.remove('active');
            sosProgress.style.width = '0%';
            sosToggle.classList.remove('active');
        }
        
        // Toggle theme
        function toggleTheme() {
            body.classList.toggle('dark-theme');
            const theme = body.classList.contains('dark-theme') ? 'Dark' : 'Light';
            showNotification('Theme Changed', `${theme} theme activated`);
        }
        
        // Search weather
        function searchWeather() {
            const location = searchInput.value.trim();
            if (location) {
                currentLocation = location;
                fetchWeather(location);
                suggestionsContainer.classList.remove('visible');
                userLocationDetected = false;
            }
        }
        
        // Share location
        function shareLocation() {
            showNotification('Location Shared', 'Your location has been shared with emergency contacts via WhatsApp');
        }
        
        // Show loader
        function showLoader() {
            hourlyForecast.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
            weeklyForecast.innerHTML = '<div class="loader"><div class="loader-spinner"></div></div>';
            currentTemp.textContent = '--°';
            weatherDesc.textContent = 'Loading...';
        }
        
        // Hide loader
        function hideLoader() {
            // Loaders are replaced with content
        }

        // Initialize the app when the DOM is loaded
        document.addEventListener('DOMContentLoaded', initApp);

        
  function showDiv(divId) {
    const slides = document.querySelectorAll('.slider-weather .slide');
    slides.forEach(slide => slide.classList.remove('active'));
    document.getElementById(divId).classList.add('active');
  }










   function shareLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Google Maps link
          const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

          // If Web Share API is supported (mobile browsers)
          if (navigator.share) {
            navigator.share({
              title: "My Location",
              text: "Here is my current location:",
              url: mapsUrl
            }).catch(err => console.log("Share failed:", err));
          } else {
            // Fallback: copy link or show
            alert("Share this link: " + mapsUrl);
          }
        },
        error => {
          alert("Error getting location: " + error.message);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }





    document.getElementById('registerBtn').addEventListener('click', function () {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const contact = document.getElementById('emergencyContact').value.trim();

    if (!name || !email || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    // Hide the modal
    document.getElementById('registrationModal').style.display = 'none';

    // Show profile toggle and set user name
    document.getElementById('userDisplayName').textContent = name;
    document.getElementById('profileToggle').style.display = 'flex';
  });

  // Toggle dropdown menu on profile button click
  document.getElementById('profileBtn').addEventListener('click', function () {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Optional: hide dropdown if clicked outside
  document.addEventListener('click', function (e) {
    const profileToggle = document.getElementById('profileToggle');
    const dropdown = document.getElementById('profileDropdown');

    if (!profileToggle.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });



   // Logout functionality
  document.getElementById('logoutLink').addEventListener('click', function (e) {
    e.preventDefault();

    // Hide profile toggle
    document.getElementById('profileToggle').style.display = 'none';

    // Clear form fields (optional)
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('emergencyContact').value = '';

    // Show registration modal again
    document.getElementById('registrationModal').style.display = 'block';

    // Hide dropdown in case it's still open
    document.getElementById('profileDropdown').style.display = 'none';
  });


  function callNow(number) {
      window.location.href = "tel:" + number;
    }






  document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    suggestionsContainer.classList.remove('visible');
  }
});










// ==== CONFIG ====
const apiKey = "3fe7b870d21073d089de4268ef258694";   // <-- put your personal GNews token here
const newsContainer = document.getElementById("news-container");
const loadMoreBtn  = document.getElementById("load-more");

// GNews search endpoint
// q supports spaces and OR logic, lang=en for English
const url =
  `https://gnews.io/api/v4/search?` +
  `q=("weather forecast" OR "climate change" OR climate)` +
  `&lang=en&sortby=publishedAt&max=50&token=${apiKey}`;

// ==== STATE ====
let allArticles = [];
let itemsPerClick = 4;
let currentIndex = 0;

// ==== FETCH ====
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    // GNews returns { articles: [...] }
    allArticles = data.articles || [];
    displayArticles();
  })
  .catch(err => {
    console.error("Error fetching news:", err);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
    loadMoreBtn.style.display = "none";
  });

// ==== RENDER ====
function displayArticles() {
  const nextArticles = allArticles.slice(currentIndex, currentIndex + itemsPerClick);

  nextArticles.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("article");
    div.innerHTML = `
      <img src="${article.image || ''}" alt="news image">
      <h2>${article.title}</h2>
      <p>${article.description || ''}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;
    newsContainer.appendChild(div);
  });

  currentIndex += itemsPerClick;

  if (currentIndex >= allArticles.length) {
    loadMoreBtn.style.display = "none";
  }
}

loadMoreBtn.addEventListener("click", displayArticles);

