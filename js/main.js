// Global Variables
let novels = [];
let currentUser = null;

// Sample novels data (will be replaced with dynamic data)
const sampleNovels = [
    {
        id: 1,
        title: "رواية الحب الأول",
        author: "أحمد محمد",
        category: "رومانسي",
        description: "قصة حب جميلة تحكي عن شاب وفتاة التقيا في الجامعة وكيف تطورت علاقتهما عبر السنين.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: true,
        publishDate: "2024-01-15",
        downloads: 1250,
        views: 3500
    },
    {
        id: 2,
        title: "مغامرات في الفضاء",
        author: "سارة أحمد",
        category: "خيال علمي",
        description: "رحلة مثيرة عبر الكواكب البعيدة مع مجموعة من المستكشفين الشجعان.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: true,
        publishDate: "2024-02-10",
        downloads: 890,
        views: 2100
    },
    {
        id: 3,
        title: "أسرار القصر القديم",
        author: "محمد علي",
        category: "غموض",
        description: "لغز محير في قصر قديم مهجور، حيث تختفي الأشياء وتظهر أخرى غامضة.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: false,
        publishDate: "2024-03-05",
        downloads: 650,
        views: 1800
    },
    {
        id: 4,
        title: "حكايات من التاريخ",
        author: "فاطمة حسن",
        category: "تاريخي",
        description: "مجموعة من القصص التاريخية المشوقة من عصور مختلفة.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: false,
        publishDate: "2024-02-28",
        downloads: 720,
        views: 1950
    },
    {
        id: 5,
        title: "رحلة إلى المجهول",
        author: "عمر خالد",
        category: "مغامرات",
        description: "مغامرة شيقة في أدغال الأمازون مع مجموعة من الباحثين عن الكنوز المفقودة.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: true,
        publishDate: "2024-01-20",
        downloads: 1100,
        views: 2800
    },
    {
        id: 6,
        title: "عالم السحر والخيال",
        author: "ليلى محمود",
        category: "فانتازيا",
        description: "عالم سحري مليء بالمخلوقات الأسطورية والمغامرات الخيالية.",
        cover: "",
        content: "هذا نص تجريبي للرواية...",
        featured: false,
        publishDate: "2024-03-12",
        downloads: 980,
        views: 2300
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadNovels();
    displayFeaturedNovels();
    displayLatestNovels();
    updateCategoryCounts();
    initializeNavigation();
    
    // Load novels from localStorage if available
    const savedNovels = localStorage.getItem('novels');
    if (savedNovels) {
        novels = JSON.parse(savedNovels);
    } else {
        novels = [...sampleNovels];
        saveNovels();
    }
    
    // Refresh displays
    displayFeaturedNovels();
    displayLatestNovels();
    updateCategoryCounts();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load novels data
function loadNovels() {
    const savedNovels = localStorage.getItem('novels');
    if (savedNovels) {
        novels = JSON.parse(savedNovels);
    } else {
        novels = [...sampleNovels];
        saveNovels();
    }
}

// Save novels to localStorage
function saveNovels() {
    localStorage.setItem('novels', JSON.stringify(novels));
    // Trigger data change event for auto-refresh
    triggerDataChange();
}

// Auto-refresh functionality
let autoRefreshInterval;
let lastDataHash = '';

// Start automatic refresh
function startAutoRefresh() {
    // Calculate initial data hash
    lastDataHash = calculateDataHash();
    
    // Check for data changes every 2 seconds
    autoRefreshInterval = setInterval(() => {
        checkForDataChanges();
    }, 2000);
}

// Stop automatic refresh
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
}

// Calculate hash of current data
function calculateDataHash() {
    const dataString = JSON.stringify(novels);
    return btoa(dataString).length; // Simple hash using base64 length
}

// Check for data changes
function checkForDataChanges() {
    const currentHash = calculateDataHash();
    if (currentHash !== lastDataHash) {
        lastDataHash = currentHash;
        refreshAllData();
    }
}

// Refresh all data and update UI
function refreshAllData() {
    loadNovels(); // Reload from localStorage
    
    // Update all displays
    if (typeof displayFeaturedNovels === 'function') displayFeaturedNovels();
    if (typeof displayLatestNovels === 'function') displayLatestNovels();
    if (typeof updateCategoryCounts === 'function') updateCategoryCounts();
    if (typeof displayNovels === 'function') displayNovels();
    
    // Show notification
    showAutoRefreshNotification();
}

// Trigger data change (called when data is modified)
function triggerDataChange() {
    // Update timestamp to trigger refresh on other pages
    localStorage.setItem('dataLastModified', Date.now().toString());
}

// Show auto-refresh notification
function showAutoRefreshNotification() {
    const notification = document.createElement('div');
    notification.className = 'auto-refresh-notification';
    notification.innerHTML = `
        <i class="fas fa-sync-alt"></i>
        تم تحديث البيانات تلقائياً
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS animations for notifications
function addAutoRefreshStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Display featured novels
function displayFeaturedNovels() {
    const container = document.getElementById('featuredNovels');
    if (!container) return;
    
    const featuredNovels = novels.filter(novel => novel.featured).slice(0, 3);
    
    if (featuredNovels.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; grid-column: 1/-1;">لا توجد روايات مميزة حالياً</p>';
        return;
    }
    
    container.innerHTML = featuredNovels.map(novel => createNovelCard(novel)).join('');
}

// Display latest novels
function displayLatestNovels() {
    const container = document.getElementById('latestNovels');
    if (!container) return;
    
    const latestNovels = novels
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 6);
    
    if (latestNovels.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; grid-column: 1/-1;">لا توجد روايات متاحة حالياً</p>';
        return;
    }
    
    container.innerHTML = latestNovels.map(novel => createNovelCard(novel)).join('');
}

// Create novel card HTML
function createNovelCard(novel) {
    return `
        <div class="novel-card" onclick="viewNovel(${novel.id})">
            <div class="novel-cover">
                ${novel.cover ? `<img src="${novel.cover}" alt="${novel.title}">` : '<i class="fas fa-book"></i>'}
            </div>
            <div class="novel-info">
                <h3 class="novel-title">${novel.title}</h3>
                <p class="novel-author">
                    <i class="fas fa-user"></i>
                    ${novel.author}
                </p>
                <p class="novel-description">${novel.description}</p>
                <div class="novel-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); readNovel(${novel.id})">
                        <i class="fas fa-book-open"></i>
                        قراءة
                    </button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); downloadNovel(${novel.id})">
                        <i class="fas fa-download"></i>
                        تحميل
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update category counts
function updateCategoryCounts() {
    const categories = ['رومانسي', 'خيال علمي', 'تاريخي', 'غموض', 'مغامرات', 'فانتازيا'];
    
    categories.forEach(category => {
        const count = novels.filter(novel => novel.category === category).length;
        const countElement = document.querySelector(`.category-card[onclick="filterByCategory('${category}')"] .novel-count`);
        if (countElement) {
            countElement.textContent = `${count} رواية`;
        }
    });
}

// Search functionality
function searchNovels() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('يرجى إدخال كلمة للبحث');
        return;
    }
    
    const results = novels.filter(novel => 
        novel.title.includes(searchTerm) || 
        novel.author.includes(searchTerm) || 
        novel.category.includes(searchTerm) ||
        novel.description.includes(searchTerm)
    );
    
    // Store search results and redirect to search page
    localStorage.setItem('searchResults', JSON.stringify(results));
    localStorage.setItem('searchTerm', searchTerm);
    window.location.href = 'search.html';
}

// Handle Enter key in search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchNovels();
            }
        });
    }
});

// Filter by category
function filterByCategory(category) {
    const results = novels.filter(novel => novel.category === category);
    localStorage.setItem('searchResults', JSON.stringify(results));
    localStorage.setItem('searchTerm', category);
    window.location.href = 'search.html';
}

// View novel details
function viewNovel(novelId) {
    localStorage.setItem('currentNovelId', novelId);
    window.location.href = 'novel-details.html';
}

// Read novel
function readNovel(novelId) {
    localStorage.setItem('currentNovelId', novelId);
    window.location.href = 'read-novel.html';
}

// Download novel
function downloadNovel(novelId) {
    // Use enhanced download function if available
    if (typeof downloadNovelEnhanced === 'function') {
        downloadNovelEnhanced(novelId);
        return;
    }
    
    // Fallback to simple download
    const novel = novels.find(n => n.id === novelId);
    if (!novel) {
        alert('الرواية غير موجودة');
        return;
    }
    
    // Create a simple text file for download
    const content = `${novel.title}\nبقلم: ${novel.author}\n\n${novel.description}\n\n${novel.content}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${novel.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Update download count
    novel.downloads = (novel.downloads || 0) + 1;
    saveNovels();
    
    alert('تم تحميل الرواية بنجاح!');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function formatNumber(num) {
    return num.toLocaleString('ar-SA');
}

// Admin functions (will be expanded in admin section)
function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

function logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; color: #2c3e50;">جاري التحميل...</p>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}


// Initialize auto-refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add auto-refresh styles
    addAutoRefreshStyles();
    
    // Start auto-refresh after a short delay
    setTimeout(() => {
        startAutoRefresh();
    }, 1000);
});

// Stop auto-refresh when page is about to unload
window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});

// Handle visibility change (when user switches tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        // Restart auto-refresh when user returns to tab
        setTimeout(() => {
            startAutoRefresh();
        }, 500);
    }
});

