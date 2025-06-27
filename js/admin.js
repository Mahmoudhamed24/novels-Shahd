// Admin JavaScript Functions

let currentTags = [];
let editingNovelId = null;

// Check admin authentication
document.addEventListener('DOMContentLoaded', function() {
    if (!isAdmin()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    initializeAdmin();
    loadDashboardData();
    updateLoginTime();
});

// Initialize admin dashboard
function initializeAdmin() {
    loadNovels();
    showSection('dashboard');
    updateStats();
    displayNovelsTable();
}

// Update login time display
function updateLoginTime() {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const date = new Date(loginTime);
        const timeString = date.toLocaleString('ar-SA');
        document.getElementById('loginTime').textContent = `تم تسجيل الدخول: ${timeString}`;
    }
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to corresponding sidebar link
    event.target.classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'manage-novels':
            displayNovelsTable();
            break;
        case 'statistics':
            loadDetailedStats();
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    updateStats();
    displayRecentNovels();
}

// Update statistics
function updateStats() {
    const statsGrid = document.getElementById('statsGrid');
    const totalNovels = novels.length;
    const totalViews = novels.reduce((sum, novel) => sum + (novel.views || 0), 0);
    const totalDownloads = novels.reduce((sum, novel) => sum + (novel.downloads || 0), 0);
    const featuredNovels = novels.filter(novel => novel.featured).length;
    
    const categories = {};
    novels.forEach(novel => {
        categories[novel.category] = (categories[novel.category] || 0) + 1;
    });
    const totalCategories = Object.keys(categories).length;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="color: var(--secondary-color);">
                <i class="fas fa-book"></i>
            </div>
            <div class="stat-number">${totalNovels}</div>
            <div class="stat-label">إجمالي الروايات</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #e74c3c;">
                <i class="fas fa-eye"></i>
            </div>
            <div class="stat-number">${formatNumber(totalViews)}</div>
            <div class="stat-label">إجمالي المشاهدات</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #27ae60;">
                <i class="fas fa-download"></i>
            </div>
            <div class="stat-number">${formatNumber(totalDownloads)}</div>
            <div class="stat-label">إجمالي التحميلات</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #f39c12;">
                <i class="fas fa-star"></i>
            </div>
            <div class="stat-number">${featuredNovels}</div>
            <div class="stat-label">الروايات المميزة</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #9b59b6;">
                <i class="fas fa-tags"></i>
            </div>
            <div class="stat-number">${totalCategories}</div>
            <div class="stat-label">التصنيفات</div>
        </div>
    `;
}

// Display recent novels
function displayRecentNovels() {
    const recentNovels = novels
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 5);
    
    const container = document.getElementById('recentNovels');
    
    if (recentNovels.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">لا توجد روايات مضافة بعد</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="novels-table">
            <thead>
                <tr>
                    <th>العنوان</th>
                    <th>المؤلف</th>
                    <th>التصنيف</th>
                    <th>تاريخ النشر</th>
                    <th>المشاهدات</th>
                </tr>
            </thead>
            <tbody>
                ${recentNovels.map(novel => `
                    <tr>
                        <td>${novel.title}</td>
                        <td>${novel.author}</td>
                        <td>${novel.category}</td>
                        <td>${formatDate(novel.publishDate)}</td>
                        <td>${formatNumber(novel.views || 0)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Display novels table
function displayNovelsTable() {
    const tableBody = document.getElementById('novelsTableBody');
    
    if (novels.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #7f8c8d;">
                    لا توجد روايات مضافة بعد
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = novels.map(novel => `
        <tr>
            <td>
                <strong>${novel.title}</strong>
                ${novel.featured ? '<span style="color: #f39c12;"><i class="fas fa-star"></i></span>' : ''}
            </td>
            <td>${novel.author}</td>
            <td>${novel.category}</td>
            <td>${formatDate(novel.publishDate)}</td>
            <td>${formatNumber(novel.views || 0)}</td>
            <td>${formatNumber(novel.downloads || 0)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-small" onclick="editNovel(${novel.id})" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="viewNovel(${novel.id})" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="deleteNovel(${novel.id})" title="حذف" style="background: #e74c3c;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Handle add novel form submission
function handleAddNovel(event) {
    event.preventDefault();
    
    const title = document.getElementById('novelTitle').value.trim();
    const author = document.getElementById('novelAuthor').value.trim();
    const category = document.getElementById('novelCategory').value;
    const description = document.getElementById('novelDescription').value.trim();
    const content = document.getElementById('novelContent').value.trim();
    const isFeatured = document.getElementById('isFeatured').checked;
    const coverFile = document.getElementById('novelCover').files[0];
    const pdfFile = document.getElementById('novelPDF').files[0];
    
    // Validation
    if (!title || !author || !category || !description) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    if (!content || content.trim() === '') {
        alert('يرجى إدخال نص الرواية كاملاً');
        return;
    }
    
    // Validate content length
    if (content.length < 100) {
        alert('نص الرواية قصير جداً. يرجى إدخال محتوى أكثر تفصيلاً');
        return;
    }
    
    // Create new novel object
    const newNovel = {
        id: editingNovelId || Date.now(),
        title,
        author,
        category,
        description,
        content: content, // Use the full content as entered
        featured: isFeatured,
        publishDate: editingNovelId ? novels.find(n => n.id === editingNovelId).publishDate : new Date().toISOString().split('T')[0],
        views: editingNovelId ? novels.find(n => n.id === editingNovelId).views : 0,
        downloads: editingNovelId ? novels.find(n => n.id === editingNovelId).downloads : 0,
        tags: [...currentTags],
        cover: '',
        pdfFile: pdfFile || null // Store PDF file if uploaded
    };
    
    // Handle file uploads (في التطبيق الحقيقي، يجب رفع الملفات إلى الخادم)
    if (coverFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newNovel.cover = e.target.result;
            saveNovelData(newNovel);
        };
        reader.readAsDataURL(coverFile);
    } else {
        saveNovelData(newNovel);
    }
}

// Save novel data
function saveNovelData(novelData) {
    if (editingNovelId) {
        // Update existing novel
        const index = novels.findIndex(n => n.id === editingNovelId);
        if (index !== -1) {
            novels[index] = novelData;
        }
        editingNovelId = null;
        alert('تم تحديث الرواية بنجاح!');
    } else {
        // Add new novel
        novels.push(novelData);
        alert('تم إضافة الرواية بنجاح!');
    }
    
    saveNovels();
    resetNovelForm();
    
    // Force immediate update of all displays
    updateAllDisplays();
    
    // Show success notification
    showAdminNotification('تم حفظ الرواية بنجاح! ستظهر للمستخدمين فوراً', 'success');
}

// Update all displays immediately
function updateAllDisplays() {
    updateStats();
    displayNovelsTable();
    updateCategoryCounts();
    displayRecentNovels();
    
    // Trigger global data refresh
    triggerGlobalDataRefresh();
}

// Trigger global data refresh for all users
function triggerGlobalDataRefresh() {
    // Update timestamp to notify all pages
    localStorage.setItem('dataLastModified', Date.now().toString());
    localStorage.setItem('forceRefresh', 'true');
}

// Show admin notification
function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Cairo', sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Reset novel form
function resetNovelForm() {
    document.querySelector('.novel-form').reset();
    currentTags = [];
    updateTagsDisplay();
    clearFilePreviews();
    editingNovelId = null;
}

// Preview uploaded image
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="معاينة الصورة" class="image-preview">
                <p><strong>الملف:</strong> ${input.files[0].name}</p>
                <p><strong>الحجم:</strong> ${(input.files[0].size / 1024 / 1024).toFixed(2)} MB</p>
            `;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview uploaded file
function previewFile(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        preview.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-file-pdf" style="font-size: 2rem; color: #e74c3c;"></i>
                <div>
                    <p><strong>الملف:</strong> ${file.name}</p>
                    <p><strong>الحجم:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
        `;
        preview.style.display = 'block';
    }
}

// Clear file previews
function clearFilePreviews() {
    document.getElementById('coverPreview').style.display = 'none';
    document.getElementById('pdfPreview').style.display = 'none';
}

// Handle tag input
function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const tag = input.value.trim();
        
        if (tag && !currentTags.includes(tag)) {
            currentTags.push(tag);
            input.value = '';
            updateTagsDisplay();
        }
    }
}

// Focus tag input
function focusTagInput() {
    document.getElementById('tagInput').focus();
}

// Update tags display
function updateTagsDisplay() {
    const container = document.getElementById('tagsContainer');
    const input = document.getElementById('tagInput');
    
    // Clear existing tags
    const existingTags = container.querySelectorAll('.tag');
    existingTags.forEach(tag => tag.remove());
    
    // Add current tags
    currentTags.forEach((tag, index) => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <span class="tag-remove" onclick="removeTag(${index})">×</span>
        `;
        container.insertBefore(tagElement, input);
    });
}

// Remove tag
function removeTag(index) {
    currentTags.splice(index, 1);
    updateTagsDisplay();
}

// Edit novel
function editNovel(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;
    
    editingNovelId = novelId;
    
    // Fill form with novel data
    document.getElementById('novelTitle').value = novel.title;
    document.getElementById('novelAuthor').value = novel.author;
    document.getElementById('novelCategory').value = novel.category;
    document.getElementById('novelDescription').value = novel.description;
    document.getElementById('novelContent').value = novel.content;
    document.getElementById('isFeatured').checked = novel.featured;
    
    // Set tags
    currentTags = novel.tags || [];
    updateTagsDisplay();
    
    // Show add novel section
    showSection('add-novel');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Delete novel
function deleteNovel(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;
    
    if (confirm(`هل أنت متأكد من حذف الرواية "${novel.title}"؟`)) {
        novels = novels.filter(n => n.id !== novelId);
        saveNovels();
        
        // Force immediate update of all displays
        updateAllDisplays();
        
        // Show success notification
        showAdminNotification(`تم حذف الرواية "${novel.title}" بنجاح! التحديث سيظهر للمستخدمين فوراً`, 'success');
    }
}

// Load detailed statistics
function loadDetailedStats() {
    const container = document.getElementById('detailedStats');
    
    // Calculate detailed stats
    const categoryStats = {};
    const authorStats = {};
    
    novels.forEach(novel => {
        // Category stats
        if (!categoryStats[novel.category]) {
            categoryStats[novel.category] = {
                count: 0,
                views: 0,
                downloads: 0
            };
        }
        categoryStats[novel.category].count++;
        categoryStats[novel.category].views += novel.views || 0;
        categoryStats[novel.category].downloads += novel.downloads || 0;
        
        // Author stats
        if (!authorStats[novel.author]) {
            authorStats[novel.author] = {
                count: 0,
                views: 0,
                downloads: 0
            };
        }
        authorStats[novel.author].count++;
        authorStats[novel.author].views += novel.views || 0;
        authorStats[novel.author].downloads += novel.downloads || 0;
    });
    
    // Most popular novel
    const mostViewed = novels.reduce((max, novel) => 
        (novel.views || 0) > (max.views || 0) ? novel : max, novels[0] || {});
    
    // Most downloaded novel
    const mostDownloaded = novels.reduce((max, novel) => 
        (novel.downloads || 0) > (max.downloads || 0) ? novel : max, novels[0] || {});
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="color: #3498db;">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-number">${mostViewed.views || 0}</div>
            <div class="stat-label">أكثر رواية مشاهدة<br><small>${mostViewed.title || 'لا توجد'}</small></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #2ecc71;">
                <i class="fas fa-download"></i>
            </div>
            <div class="stat-number">${mostDownloaded.downloads || 0}</div>
            <div class="stat-label">أكثر رواية تحميلاً<br><small>${mostDownloaded.title || 'لا توجد'}</small></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #e67e22;">
                <i class="fas fa-tags"></i>
            </div>
            <div class="stat-number">${Object.keys(categoryStats).length}</div>
            <div class="stat-label">عدد التصنيفات</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="color: #9b59b6;">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-number">${Object.keys(authorStats).length}</div>
            <div class="stat-label">عدد المؤلفين</div>
        </div>
    `;
}

// Refresh data
function refreshData() {
    loadNovels();
    updateAllDisplays();
    showAdminNotification('تم تحديث البيانات بنجاح', 'success');
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('loginTime');
        window.location.href = 'admin-login.html';
    }
}

