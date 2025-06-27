// PDF Handler for Novel Downloads and Reading

// Enhanced download function with PDF only
function downloadNovelEnhanced(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) {
        alert('الرواية غير موجودة');
        return;
    }
    
    // Direct PDF download without options modal
    downloadAsPDF(novelId);
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

// Download as PDF (enhanced version with jsPDF)
function downloadAsPDF(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;
    
    // Show loading message
    showNotification('جاري إنشاء ملف PDF...', 'info');
    
    // If the novel has an uploaded PDF file, use it
    if (novel.pdfFile && novel.pdfFile instanceof File) {
        // Create download link for uploaded PDF
        const url = URL.createObjectURL(novel.pdfFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${novel.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Update download count
        novel.downloads = (novel.downloads || 0) + 1;
        saveNovels();
        showNotification('تم تحميل ملف PDF بنجاح!', 'success');
        return;
    }
    
    // Create PDF from novel content using browser's print functionality
    createPDFFromContent(novel);
}

// Create PDF from novel content
function createPDFFromContent(novel) {
    // Create a new window with the novel content formatted for PDF
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${novel.title}</title>
            <style>
                @page {
                    size: A4;
                    margin: 2cm;
                }
                body {
                    font-family: 'Arial', 'Tahoma', sans-serif;
                    line-height: 1.8;
                    color: #333;
                    direction: rtl;
                    text-align: right;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 1cm;
                    margin-bottom: 2cm;
                    page-break-after: avoid;
                }
                .title {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 0.5cm;
                    color: #2c3e50;
                }
                .author {
                    font-size: 20px;
                    color: #7f8c8d;
                    margin-bottom: 0.3cm;
                }
                .category {
                    font-size: 16px;
                    color: #95a5a6;
                }
                .description {
                    background: #f8f9fa;
                    padding: 1cm;
                    border-right: 4px solid #3498db;
                    margin: 2cm 0;
                    font-style: italic;
                }
                .content {
                    text-align: justify;
                    font-size: 16px;
                    line-height: 2;
                }
                .chapter {
                    font-size: 20px;
                    font-weight: bold;
                    margin: 2cm 0 1cm 0;
                    color: #2c3e50;
                    page-break-before: auto;
                }
                .footer {
                    margin-top: 3cm;
                    text-align: center;
                    font-size: 12px;
                    color: #7f8c8d;
                    border-top: 1px solid #ecf0f1;
                    padding-top: 1cm;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">${novel.title}</div>
                <div class="author">بقلم: ${novel.author}</div>
                <div class="category">التصنيف: ${novel.category}</div>
            </div>
            
            <div class="description">
                <h3>وصف الرواية:</h3>
                <p>${novel.description}</p>
            </div>
            
            <div class="content">
                ${formatNovelContentForPDF(novel.content)}
            </div>
            
            <div class="footer">
                <p>تم تحميل هذه الرواية من مكتبة الروايات</p>
                <p>© ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Update download count
    novel.downloads = (novel.downloads || 0) + 1;
    saveNovels();
    
    showNotification('تم فتح نافذة الطباعة. اختر "حفظ كـ PDF" من خيارات الطباعة', 'success');
}

// Format novel content for PDF
function formatNovelContentForPDF(content) {
    if (!content) return '<p>لا يوجد محتوى متاح</p>';
    
    // Split content into paragraphs and chapters
    const lines = content.split('\n');
    let formattedContent = '';
    
    lines.forEach(line => {
        line = line.trim();
        if (line === '') {
            formattedContent += '<br>';
        } else if (line.startsWith('الفصل') || line.startsWith('Chapter') || line.match(/^\d+\./)) {
            formattedContent += `<div class="chapter">${line}</div>`;
        } else {
            formattedContent += `<p>${line}</p>`;
        }
    });
    
    return formattedContent || '<p>لا يوجد محتوى متاح</p>';
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

