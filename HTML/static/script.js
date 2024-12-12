let currentEditingTool = null;

function showAddToolForm() {
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
            userAdded: true // Mark as user-added tool
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
        .then(data => {
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
    const name = button.getAttribute('data-name');
    const description = button.getAttribute('data-description');
    const link = button.getAttribute('data-link');
    const tags = button.getAttribute('data-tags');

    currentEditingTool = button;

    document.getElementById('edit-tool-form').style.display = 'block';
    document.getElementById('edit-old-name').value = name;
    document.getElementById('edit-tool-name').value = name;
    document.getElementById('edit-tool-description').value = description;
    document.getElementById('edit-tool-link').value = link;
    document.getElementById('edit-tool-tags').value = tags;
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

document.addEventListener('DOMContentLoaded', () => {
    const tools = document.querySelectorAll('#tools-list li');
    tools.forEach(tool => {
        const editButton = tool.querySelector('.edit-button');
        console.log('Edit Button:', editButton); // Check if this logs the button element
        if (editButton && tool.getAttribute('data-user-added') === 'true') {
            editButton.style.display = 'inline-block';
        } else if (editButton) {
            editButton.style.display = 'none';
        }
    });
});

