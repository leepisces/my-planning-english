// PDF Viewer functionality
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;

// Base path for PDF files
const basePath = "";

// Map of activity IDs to PDF pages
const pdfPageMap = {
  // Unit 1 - Week 1
  "1-2-vocabulary": { file: "top_notch_3_sb.pdf", page: 2, title: "Top Notch 3 - Lesson 1 Vocabulary" },
  "1-2-grammar": { file: "top_notch_3_sb.pdf", page: 3, title: "Top Notch 3 - Lesson 1 Grammar" },
  "1-2-listening": { file: "top_notch_3_sb.pdf", page: 4, title: "Top Notch 3 - Lesson 1 Listening" },
  "1-4-conversation": { file: "top_notch_3_sb.pdf", page: 5, title: "Top Notch 3 - Lesson 2 Conversation" },
  "1-4-grammar": { file: "top_notch_3_sb.pdf", page: 6, title: "Top Notch 3 - Lesson 2 Grammar" },
  "1-4-workbook": { file: "top_notch_3_wb.pdf", page: 2, title: "Top Notch 3 Workbook - Lesson 2" },
  "1-6-reading": { file: "  top_notch_3_sb.pdf", page: 8, title: "Top Notch 3 - Lesson 3 Reading" },
  "1-6-writing": { file: "top_notch_3_sb.pdf", page: 10, title: "Top Notch 3 - Lesson 4 Writing" },
  "1-6-review": { file: "top_notch_3_sb.pdf", page: 12, title: "Top Notch 3 - Unit 1 Review" },
};

// Function to render the current page
function renderPage(num) {
  pageRendering = true;
  
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.getElementById("pdfCanvas");
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    
    const renderTask = page.render(renderContext);
    
    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
  
  // Update page counters
  document.getElementById("currentPage").textContent = num;
}

// Function to display previous page
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

// Function to display next page
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}

// Function to queue the page rendering
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

// Function to load and display PDF
function loadPDF(pdfPath, initialPage, title) {
  // Open the PDF in a new tab and try to navigate to the specific page
  // Add #page=N to the URL to try to make the PDF viewer go to that page
  const pageParam = initialPage ? `#page=${initialPage}` : '';
  window.open(pdfPath + pageParam, '_blank');
}

// Add event listeners to activity icons
document.addEventListener("DOMContentLoaded", function() {
  // Set up PDF viewer controls
  document.getElementById("prevPage").addEventListener("click", onPrevPage);
  document.getElementById("nextPage").addEventListener("click", onNextPage);
  document.querySelector(".pdf-close").addEventListener("click", function() {
    document.getElementById("pdfModal").style.display = "none";
  });
  
  // Add click handlers to all activity icons
  const activityIcons = document.querySelectorAll(".activity-icon");
  activityIcons.forEach((icon, index) => {
    const activity = icon.closest(".activity");
    const dayCard = activity.closest(".day-card");
    const dayId = dayCard ? dayCard.getAttribute("data-day") : null;
    
    if (dayId) {
      // Determine activity type from the title or icon
      const activityTitle = activity.querySelector(".activity-title").textContent.toLowerCase();
      const activityIcon = activity.querySelector(".activity-icon").textContent;
      
      // Use both title text and emoji icons to determine activity type
      let activityType = "general";
      
      // Check for emojis first (more reliable with encoding issues)
      if (activityIcon.includes("📚")) {
        activityType = "vocabulary";
      } else if (activityIcon.includes("🔤")) {
        activityType = "grammar";
      } else if (activityIcon.includes("🎧")) {
        activityType = "listening";
      } else if (activityIcon.includes("💬")) {
        activityType = "conversation";
      } else if (activityIcon.includes("📝")) {
        activityType = "workbook";
      } else if (activityIcon.includes("📖")) {
        activityType = "reading";
      } else if (activityIcon.includes("✍️")) {
        activityType = "writing";
      } else if (activityIcon.includes("📋")) {
        activityType = "review";
      }
      
      // Fallback to text matching if icon doesn't match
      if (activityType === "general") {
        if (activityTitle.includes("từ vựng") || activityTitle.includes("tu vung") || activityTitle.includes("vocabulary")) {
          activityType = "vocabulary";
        } else if (activityTitle.includes("ngữ pháp") || activityTitle.includes("ngu phap") || activityTitle.includes("grammar")) {
          activityType = "grammar";
        } else if (activityTitle.includes("nghe") || activityTitle.includes("listening")) {
          activityType = "listening";
        } else if (activityTitle.includes("hội thoại") || activityTitle.includes("hoi thoai") || activityTitle.includes("conversation")) {
          activityType = "conversation";
        } else if (activityTitle.includes("workbook")) {
          activityType = "workbook";
        } else if (activityTitle.includes("reading") || activityTitle.includes("đọc") || activityTitle.includes("doc")) {
          activityType = "reading";
        } else if (activityTitle.includes("writing") || activityTitle.includes("viết") || activityTitle.includes("viet")) {
          activityType = "writing";
        } else if (activityTitle.includes("review") || activityTitle.includes("ôn tập") || activityTitle.includes("on tap")) {
          activityType = "review";
        }
      }
      
      const mapKey = `${dayId}-${activityType}`;
      
      if (pdfPageMap[mapKey]) {
        icon.setAttribute("title", "Click to view PDF");
        icon.style.cursor = "pointer";
        
        icon.addEventListener("click", function() {
          const pdfInfo = pdfPageMap[mapKey];
          loadPDF(pdfInfo.file, pdfInfo.page, pdfInfo.title);
        });
      }
    }
  });
});

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById("pdfModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};