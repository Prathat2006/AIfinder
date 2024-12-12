
let currentEditingTool = null;

function toggleAddToolForm() {
    const form = document.getElementById('add-tool-form');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function toggleEditToolForm() {
    const form = document.getElementById('edit-tool-form');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
}

function addTool() {
const name = document.getElementById('tool-name').value;
const description = document.getElementById('tool-description').value;
const link = document.getElementById('tool-link').value;
const tags = document.getElementById('tool-tags').value;

if (name && description && link && tags) {
// Create the tool object
const newTool = {
    name: name,
    description: description,
    link: link,
    tags: tags.toLowerCase(),
    userAdded: true
};

// Send the tool data to the server to save
fetch('/tools', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTool)
})
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to add tool');
    }
})
.then(() => {
    alert('Tool added successfully');
    location.reload(); // Refresh to show the new tool
})
.catch(error => {
    alert(error.message);
});
} else {
alert('Please fill in all fields.');
}
}


function prepareEditTool(button) {
    const tool = button.parentElement;
    
    // Only allow editing for user-added tools
    if (tool.getAttribute('data-user-added') !== 'true') {
        alert('You can only edit tools that you have added.');
        return;
    }

    currentEditingTool = tool;

    // Populate edit form
    document.getElementById('edit-tool-name').value = tool.querySelector('.tool-name').textContent;
    document.getElementById('edit-tool-description').value = tool.querySelector('.description').textContent;
    document.getElementById('edit-tool-link').value = tool.querySelector('.link').href;
    document.getElementById('edit-tool-tags').value = tool.getAttribute('data-tags');

    // Show edit form
    toggleEditToolForm();
}

function saveEditedTool() {
    if (!currentEditingTool) return;

    const name = document.getElementById('edit-tool-name').value;
    const description = document.getElementById('edit-tool-description').value;
    const link = document.getElementById('edit-tool-link').value;
    const tags = document.getElementById('edit-tool-tags').value;

    if (name && description && link && tags) {
        currentEditingTool.querySelector('.tool-name').textContent = name;
        currentEditingTool.querySelector('.description').textContent = description;
        currentEditingTool.querySelector('.link').textContent = `Visit ${name}`;
        currentEditingTool.querySelector('.link').href = link;
        currentEditingTool.querySelector('.tags').textContent = `Tags: ${tags}`;
        currentEditingTool.setAttribute('data-tags', tags.toLowerCase());

        // Hide edit form
        toggleEditToolForm();
        currentEditingTool = null;
    } else {
        alert('Please fill in all fields.');
    }
}

function searchTools() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const tools = document.querySelectorAll('#tools-list li');

    tools.forEach(tool => {
        const name = tool.querySelector('.tool-name').textContent.toLowerCase();
        const description = tool.querySelector('.description').textContent.toLowerCase();
        const tags = tool.getAttribute('data-tags');

        if (name.includes(query) || description.includes(query) || tags.includes(query)) {
            tool.style.display = '';
        } else {
            tool.style.display = 'none';
        }
    });
}

// Show edit buttons only for user-added tools
document.addEventListener('DOMContentLoaded', () => {
    const tools = document.querySelectorAll('#tools-list li');
    tools.forEach(tool => {
        // Force hide edit buttons for default tools
        const editButton = tool.querySelector('.edit-button');
        editButton.style.display = 'none';
    });
});
