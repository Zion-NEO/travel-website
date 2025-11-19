document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Logout when leaving
    const viewSiteBtn = document.querySelector('a[href="index.html"]');
    if (viewSiteBtn) {
        viewSiteBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
        });
    }

    const editorList = document.getElementById('editor-list');
    const saveBtn = document.getElementById('save-all-btn');
    let itineraryData = [];

    // Logout Button Logic (Optional, can be added to UI later)
    // localStorage.removeItem('isLoggedIn');

    // Fetch Data
    fetch('/api/itinerary')
        .then(response => response.json())
        .then(data => {
            itineraryData = data;
            renderEditors();
        })
        .catch(err => console.error('Error loading data:', err));

    function renderEditors() {
        editorList.innerHTML = '';
        itineraryData.forEach((day, index) => {
            const dayEl = document.createElement('div');
            dayEl.className = 'day-editor';
            dayEl.innerHTML = `
                <div class="form-group">
                    <label>日期標題 (Day)</label>
                    <input type="text" value="${day.day}" data-field="day" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>主標題 (Title)</label>
                    <input type="text" value="${day.title}" data-field="title" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>簡短描述 (Description)</label>
                    <input type="text" value="${day.description}" data-field="description" data-index="${index}">
                </div>
                <div class="form-group">
                    <label>詳細行程 (Details)</label>
                    <div class="details-list" id="details-${index}">
                        ${day.details.map((detail, dIndex) => `
                            <div class="detail-item">
                                <input type="text" value="${detail}" onchange="updateDetail(${index}, ${dIndex}, this.value)">
                                <button class="remove-btn" onclick="removeDetail(${index}, ${dIndex})">X</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-btn" onclick="addDetail(${index})">+ 新增詳細項目</button>
                </div>
            `;
            editorList.appendChild(dayEl);
        });

        // Add event listeners for inputs
        document.querySelectorAll('input[data-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                const index = e.target.dataset.index;
                itineraryData[index][field] = e.target.value;
            });
        });
    }

    // Global functions for dynamic HTML
    window.updateDetail = (dayIndex, detailIndex, value) => {
        itineraryData[dayIndex].details[detailIndex] = value;
    };

    window.removeDetail = (dayIndex, detailIndex) => {
        itineraryData[dayIndex].details.splice(detailIndex, 1);
        renderEditors(); // Re-render to update indices
    };

    window.addDetail = (dayIndex) => {
        itineraryData[dayIndex].details.push("新項目");
        renderEditors();
    };

    // Save Data
    saveBtn.addEventListener('click', () => {
        fetch('/api/itinerary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itineraryData)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('儲存成功！');
                } else {
                    alert('儲存失敗');
                }
            })
            .catch(err => alert('Error saving data'));
    });
});
