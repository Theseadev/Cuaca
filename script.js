// Konfigurasi API
const API_KEY = '05eded6cdde92c6796e23fef2cd448c7';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Storage untuk menyimpan data kota
let cities = JSON.parse(localStorage.getItem('weatherCities')) || [];
let charts = []; // Array untuk menyimpan instance Chart.js

// Notification system
let notifications = JSON.parse(localStorage.getItem('weatherNotifications')) || [];
let notificationCount = 0;

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Set tema awal
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    displayCities();
    loadNotifications();

    // Event listener untuk enter key di input kota
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCity();
        }
    });

    // Event listener untuk toggle tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Event listener untuk ekspor data
    document.getElementById('exportData').addEventListener('click', exportData);
    
    // Notification system event listeners
    document.getElementById('notificationBtn').addEventListener('click', toggleNotificationPanel);
    document.getElementById('closeNotifications').addEventListener('click', closeNotificationPanel);
    document.getElementById('clearNotifications').addEventListener('click', clearNotifications);
    
    // Check for weather alerts (extreme temperatures, rain forecast, etc.)
    setTimeout(checkWeatherAlerts, 2000);  // Check shortly after loading
});

// Function to toggle notification panel
function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
        updateNotificationBadge(0);  // Reset the badge when opening the panel
    }
}

// Function to close notification panel
function closeNotificationPanel() {
    document.getElementById('notificationPanel').style.display = 'none';
}

// Function to add a notification
function addNotification(title, message, type = 'info') {
    const now = new Date();
    const notification = {
        id: Date.now(),
        title: title,
        message: message,
        type: type,  // 'info', 'warning', 'alert'
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        read: false
    };
    
    notifications.unshift(notification);  // Add to start of array
    if (notifications.length > 20) notifications = notifications.slice(0, 20);  // Max 20 notifications
    
    localStorage.setItem('weatherNotifications', JSON.stringify(notifications));
    displayNotification(notification);
    updateNotificationBadge(notificationCount + 1);
}

// Function to display a notification
function displayNotification(notification) {
    const notificationList = document.getElementById('notificationList');
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    notificationItem.dataset.id = notification.id;
    
    let iconClass = 'fas fa-info-circle';
    if (notification.type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    if (notification.type === 'alert') iconClass = 'fas fa-bolt';
    
    notificationItem.innerHTML = `
        <div class="notification-icon"><i class="${iconClass}"></i></div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-desc">${notification.message}</div>
        </div>
        <div class="notification-time">${notification.time}</div>
    `;
    
    notificationList.prepend(notificationItem);
}

// Function to load notifications from storage
function loadNotifications() {
    if (notifications.length === 0) return;
    
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = '';
    
    let unreadCount = 0;
    
    notifications.forEach(notification => {
        displayNotification(notification);
        if (!notification.read) unreadCount++;
    });
    
    updateNotificationBadge(unreadCount);
}

// Function to update notification badge count
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    notificationCount = count;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

// Function to clear all notifications
function clearNotifications() {
    notifications = [];
    localStorage.setItem('weatherNotifications', JSON.stringify(notifications));
    document.getElementById('notificationList').innerHTML = '';
    updateNotificationBadge(0);
}

// Function to check for weather alerts
function checkWeatherAlerts() {
    if (cities.length === 0) return;
    
    let extremeWeatherFound = false;
    
    cities.forEach(city => {
        const temp = city.main.temp;
        const weather = city.weather[0].main;
        const cityName = city.name;
        
        // Check for extreme temperatures
        if (temp > 35) {
            addNotification(
                `Suhu ekstrim di ${cityName}`,
                `Suhu sangat panas: ${Math.round(temp)}°C. Hindari aktivitas luar ruangan!`,
                'alert'
            );
            extremeWeatherFound = true;
        }
        else if (temp < 0) {
            addNotification(
                `Suhu sangat rendah di ${cityName}`,
                `Suhu di bawah 0°C: ${Math.round(temp)}°C. Kenakan pakaian hangat!`,
                'alert'
            );
            extremeWeatherFound = true;
        }
        
        // Check for rain or storms
        if (weather === 'Rain' || weather === 'Thunderstorm') {
            addNotification(
                `${weather === 'Rain' ? 'Hujan' : 'Badai'} di ${cityName}`,
                `${weather === 'Rain' ? 'Hujan' : 'Badai petir'} terdeteksi. Pastikan membawa payung!`,
                'warning'
            );
            extremeWeatherFound = true;
        }
    });
    
    // If no extreme weather, maybe add a general notification
    if (!extremeWeatherFound && Math.random() > 0.7) {
        const tips = [
            'Tip: Ingatlah untuk minum cukup air sepanjang hari.',
            'Tip: Cek prakiraan cuaca secara rutin untuk perencanaan aktivitas.',
            'Tip: Lindungi kulit Anda dari sinar matahari berlebih.',
            'Tip: Persiapkan payung saat keluar rumah jika terlihat mendung.'
        ];
        
        addNotification(
            'Tips Cuaca Hari Ini',
            tips[Math.floor(Math.random() * tips.length)],
            'info'
        );
    }
}

// Fungsi untuk toggle tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Fungsi untuk ekspor data
function exportData() {
    const dataStr = JSON.stringify(cities, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = message ? 'block' : 'none';
    if (message) {
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Fungsi untuk menampilkan loading
function showLoading(show = true) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Fungsi untuk mendapatkan cuaca berdasarkan nama kota
async function getWeatherByCity(cityName) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=id`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Kota tidak ditemukan');
            throw new Error('Gagal mengambil data cuaca');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data cuaca');
    }
}

// Fungsi untuk mendapatkan cuaca berdasarkan koordinat
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
        if (!response.ok) throw new Error('Gagal mendapatkan data cuaca untuk lokasi');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data cuaca untuk lokasi saat ini');
    }
}

// Fungsi untuk mendapatkan ramalan 6 hari
async function getForecast(cityName) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=id`);
        if (!response.ok) throw new Error('Gagal mengambil data ramalan');
        const data = await response.json();
        
        // Kelompokkan data berdasarkan tanggal unik
        const dailyData = [];
        const seenDates = new Set();
        
        for (const item of data.list) {
            const date = new Date(item.dt * 1000).toLocaleDateString('id-ID');
            if (!seenDates.has(date) && dailyData.length < 7) {
                seenDates.add(date);
                // Prioritaskan data sekitar tengah hari (09:00 - 15:00) jika tersedia
                if (item.dt_txt.includes('12:00:00') || item.dt_txt.includes('09:00:00') || item.dt_txt.includes('15:00:00')) {
                    dailyData.push(item);
                } else if (!dailyData.some(d => new Date(d.dt * 1000).toLocaleDateString('id-ID') === date)) {
                    dailyData.push(item); // Fallback ke data lain jika tidak ada tengah hari
                }
            }
        }
        
        // Mulai dari besok (index 1) hingga 6 hari ke depan
        return dailyData.slice(1, 7);
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data ramalan');
    }
}

// Fungsi untuk mendapatkan ramalan berdasarkan koordinat
async function getForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`);
        if (!response.ok) throw new Error('Gagal mengambil data ramalan');
        const data = await response.json();
        
        // Kelompokkan data berdasarkan tanggal unik
        const dailyData = [];
        const seenDates = new Set();
        
        for (const item of data.list) {
            const date = new Date(item.dt * 1000).toLocaleDateString('id-ID');
            if (!seenDates.has(date) && dailyData.length < 7) {
                seenDates.add(date);
                // Prioritaskan data sekitar tengah hari (09:00 - 15:00) jika tersedia
                if (item.dt_txt.includes('12:00:00') || item.dt_txt.includes('09:00:00') || item.dt_txt.includes('15:00:00')) {
                    dailyData.push(item);
                } else if (!dailyData.some(d => new Date(d.dt * 1000).toLocaleDateString('id-ID') === date)) {
                    dailyData.push(item); // Fallback ke data lain jika tidak ada tengah hari
                }
            }
        }
        
        // Mulai dari besok (index 1) hingga 6 hari ke depan
        return dailyData.slice(1, 7);
    } catch (error) {
        throw new Error(error.message || 'Gagal mengambil data ramalan');
    }
}

// Fungsi untuk menambah kota
async function addCity() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();

    if (!cityName) {
        showError('Mohon masukkan nama kota');
        return;
    }

    if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
        showError('Kota sudah ditambahkan');
        return;
    }

    showLoading(true);

    try {
        const weatherData = await getWeatherByCity(cityName);
        cities.push(weatherData);
        localStorage.setItem('weatherCities', JSON.stringify(cities));
        displayCities();
        cityInput.value = '';
        showError('');
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fungsi untuk mendapatkan cuaca lokasi saat ini
async function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation tidak didukung oleh browser ini');
        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await getWeatherByCoords(latitude, longitude);

                const existingIndex = cities.findIndex(city => city.name === 'Lokasi Saat Ini');
                if (existingIndex !== -1) {
                    cities[existingIndex] = weatherData;
                } else {
                    weatherData.name = 'Lokasi Saat Ini';
                    cities.unshift(weatherData);
                }

                localStorage.setItem('weatherCities', JSON.stringify(cities));
                displayCities();
                showError('');
            } catch (error) {
                showError(error.message);
            } finally {
                showLoading(false);
            }
        },
        (error) => {
            showLoading(false);
            showError('Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
        }
    );
}

// Fungsi untuk menghapus kota
function removeCity(index) {
    const cityName = cities[index].name;
    const cityId = `city-${cityName.replace(/\s+/g, '-').toLowerCase()}`;
    
    cities.splice(index, 1);
    localStorage.setItem('weatherCities', JSON.stringify(cities));
    
    const cityElement = document.getElementById(cityId);
    if (cityElement) {
        cityElement.remove();
    }
    
    if (cities.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
    }
}

// Fungsi untuk mendapatkan ikon cuaca
function getWeatherIcon(weatherMain) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️'
    };
    return icons[weatherMain] || '🌤️';
}

// Fungsi untuk membuat grafik suhu
function createWeatherChart(canvasId, forecastData) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = forecastData.map(item => new Date(item.dt * 1000).toLocaleDateString('id-ID', { weekday: 'short' }));
    const temperatures = forecastData.map(item => Math.round(item.main.temp));

    const existingChart = charts.find(chart => chart.canvas.id === canvasId);
    if (existingChart) {
        existingChart.destroy();
        charts = charts.filter(chart => chart.canvas.id !== canvasId);
    }

    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Suhu (°C)',
                data: temperatures,
                borderColor: '#0984e3',
                backgroundColor: 'rgba(9, 132, 227, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Suhu (°C)' }
                },
                x: {
                    title: { display: true, text: 'Hari' }
                }
            }
        }
    });

    charts.push(newChart);
}

// Fungsi untuk menampilkan semua kota dan cuaca
async function displayCities() {
    const container = document.getElementById('weatherContainer');
    const emptyState = document.getElementById('emptyState');

    charts.forEach(chart => chart.destroy());
    charts = [];

    if (cities.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    if (container.children.length === 0) {
        container.innerHTML = '';
    }
    
    for (let index = 0; index < cities.length; index++) {
        const city = cities[index];
        const cityId = `city-${city.name.replace(/\s+/g, '-').toLowerCase()}`;
        
        if (document.getElementById(cityId)) {
            continue;
        }
        
        let forecastHtml = '';
        try {
            const forecastData = city.name === 'Lokasi Saat Ini' ? 
                await getForecastByCoords(city.coord.lat, city.coord.lon) :
                await getForecast(city.name);
            
            forecastHtml = `
                <div class="forecast-section">
                    <div class="forecast-title">Prakiraan 5 Hari</div>
                    <div class="forecast-grid">
                        ${forecastData.map(day => `
                            <div class="forecast-card">
                                <div class="forecast-day">${new Date(day.dt * 1000).toLocaleDateString('id-ID', { weekday: 'long' })}</div>
                                <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                                <div class="description">${getWeatherIcon(day.weather[0].main)} ${day.weather[0].description}</div>
                            </div>
                        `).join('')}
                    </div>
                    <canvas id="chart-${index}" class="weather-chart"></canvas>
                </div>
            `;
        } catch (error) {
            console.error('Gagal memuat ramalan:', error);
            forecastHtml = '<div class="forecast-section">Gagal memuat prakiraan cuaca</div>';
        }

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.id = cityId;
        weatherCard.innerHTML = `
            <div class="city-name">
                ${getWeatherIcon(city.weather[0].main)} ${city.name}, ${city.sys.country}
            </div>
            <div class="temperature">${Math.round(city.main.temp)}°C</div>
            <div class="description">${city.weather[0].description}</div>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-icon">🌡️</span>
                    <span>Terasa: ${Math.round(city.main.feels_like)}°C</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">💧</span>
                    <span>Kelembaban: ${city.main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">💨</span>
                    <span>Angin: ${city.wind.speed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">👁️</span>
                    <span>Jarak Pandang: ${(city.visibility / 1000).toFixed(1)} km</span>
                </div>
            </div>
            <button class="remove-btn" onclick="removeCity(${index})">
                🗑️ Hapus Kota
            </button>
            ${forecastHtml}
        `;
        
        container.appendChild(weatherCard);

        if (forecastHtml.includes('canvas')) {
            const forecastData = city.name === 'Lokasi Saat Ini' ? 
                await getForecastByCoords(city.coord.lat, city.coord.lon) :
                await getForecast(city.name);
            createWeatherChart(`chart-${index}`, forecastData);
        }
    }
}

// Fungsi untuk refresh data cuaca setiap kota
async function refreshWeatherData() {
    if (cities.length === 0) return;

    showLoading(true);

    try {
        const promises = cities.map(async (city, index) => {
            if (city.name === 'Lokasi Saat Ini') {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const updatedData = await getWeatherByCoords(latitude, longitude);
                updatedData.name = 'Lokasi Saat Ini';
                return updatedData;
            } else {
                return getWeatherByCity(city.name);
            }
        });

        const updatedCities = await Promise.all(promises);
        
        const container = document.getElementById('weatherContainer');
        container.innerHTML = '';
        
        cities = updatedCities;
        localStorage.setItem('weatherCities', JSON.stringify(cities));
        
        displayCities();
    } catch (error) {
        showError('Gagal memperbarui data cuaca');
    } finally {
        showLoading(false);
    }
}

// Auto refresh setiap 10 menit (600000 ms)
setInterval(refreshWeatherData, 600000);