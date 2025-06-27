// PDF Handler for Novel Downloads and Reading

// Enhanced download function with PDF support
function downloadNovelEnhanced(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) {
        alert('الرواية غير موجودة');
        return;
    }
    
    // Show download options
    const downloadOptions = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        " onclick="closeDownloadModal()">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            " onclick="event.stopPropagation()">
                <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">تحميل الرواية</h3>
                <p style="margin-bottom: 2rem; color: #7f8c8d;">${novel.title}</p>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button onclick="downloadAsTXT(${novelId})" style="
                        padding: 1rem;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">
                        <i class="fas fa-file-alt"></i>
                        تحميل كملف نصي (TXT)
                    </button>
                    <button onclick="downloadAsPDF(${novelId})" style="
                        padding: 1rem;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">
                        <i class="fas fa-file-pdf"></i>
                        تحميل كملف PDF
                    </button>
                    <button onclick="closeDownloadModal()" style="
                        padding: 1rem;
                        background: #95a5a6;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                    ">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', downloadOptions);
}

// Close download modal
function closeDownloadModal() {
    const modal = document.querySelector('[onclick="closeDownloadModal()"]');
    if (modal) {
        modal.remove();
    }
}

// Download as TXT
function downloadAsTXT(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;
    
    const content = `${novel.title}
بقلم: ${novel.author}
التصنيف: ${novel.category}

${novel.description}

${'-'.repeat(50)}

${novel.content}

${'-'.repeat(50)}

تم تحميل هذه الرواية من مكتبة الروايات
© 2025 جميع الحقوق محفوظة`;
    
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
    
    closeDownloadModal();
    showNotification('تم تحميل الرواية بصيغة TXT بنجاح!', 'success');
}

// Download as PDF (simplified version)
function downloadAsPDF(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;
    
    // If the novel has an uploaded PDF file, use it
    if (novel.pdfFile) {
        // In a real application, this would download the actual PDF file
        showNotification('ملف PDF الأصلي غير متوفر في هذا الإصدار التجريبي', 'warning');
        closeDownloadModal();
        return;
    }
    
    // Create a simple HTML page and convert to PDF (client-side simulation)
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${novel.title}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.8;
                    margin: 2cm;
                    color: #333;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 1cm;
                    margin-bottom: 2cm;
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 0.5cm;
                }
                .author {
                    font-size: 18px;
                    color: #666;
                }
                .content {
                    text-align: justify;
                    font-size: 14px;
                }
                .footer {
                    margin-top: 2cm;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 1cm;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">${novel.title}</div>
                <div class="author">بقلم: ${novel.author}</div>
                <div>التصنيف: ${novel.category}</div>
            </div>
            <div class="content">
                <h3>وصف الرواية:</h3>
                <p>${novel.description}</p>
                <h3>المحتوى:</h3>
                <p>${novel.content.replace(/\n/g, '</p><p>')}</p>
            </div>
            <div class="footer">
                <p>تم تحميل هذه الرواية من مكتبة الروايات</p>
                <p>© 2025 جميع الحقوق محفوظة</p>
            </div>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${novel.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Update download count
    novel.downloads = (novel.downloads || 0) + 1;
    saveNovels();
    
    closeDownloadModal();
    showNotification('تم تحميل الرواية بصيغة HTML (يمكن طباعتها كـ PDF)', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        font-family: 'Cairo', sans-serif;
        max-width: 400px;
        text-align: center;
        animation: slideDown 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// Enhanced reading experience
function enhanceReadingExperience() {
    // Add reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.id = 'readingProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', updateReadingProgress);
}

// Update reading progress
function updateReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
}

// Initialize enhanced features on reading page
if (window.location.pathname.includes('read-novel.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        enhanceReadingExperience();
        
        // Add keyboard shortcuts info
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            max-width: 200px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        shortcutsInfo.innerHTML = `
            <strong>اختصارات لوحة المفاتيح:</strong><br>
            Ctrl + : تكبير الخط<br>
            Ctrl - : تصغير الخط<br>
            ← : الفصل التالي<br>
            → : الفصل السابق<br>
            Esc : العودة
        `;
        
        shortcutsInfo.addEventListener('mouseenter', () => {
            shortcutsInfo.style.opacity = '1';
        });
        
        shortcutsInfo.addEventListener('mouseleave', () => {
            shortcutsInfo.style.opacity = '0.7';
        });
        
        document.body.appendChild(shortcutsInfo);
    });
}

