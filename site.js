// Select the Save and Load buttons
const saveButton = document.getElementById('save-workflow');
const loadButton = document.getElementById('load-workflow');
const workflowArea = document.getElementById('workflow');

let workflowData = []; // This array stores the flow data
let dragSourceIndex = null; // To track the source index of the dragged item

// Function to save workflow item
function saveWorkflowItem(type) {
    let workflowItem = {
        type: type,
        id: workflowData.length + 1
    };

    // Prompt user for condition if the type is a condition (if, else if, else)
    if (type === 'if-condition' || type === 'else-if-condition' || type === 'else-condition') {
        const condition = prompt("Enter the condition (e.g., x > 5):");
        workflowItem.condition = condition || 'No condition'; // Default if no input
    }

    // Prompt user for loop details if the type is a loop (for, while)
    if (type === 'for-loop') {
        const iterations = prompt("Enter the number of iterations for the loop:");
        workflowItem.iterations = parseInt(iterations) || 1; // Default to 1 if invalid input
    }

    if (type === 'while-loop') {
        const loopCondition = prompt("Enter the while loop condition (e.g., x < 10):");
        workflowItem.condition = loopCondition || 'true'; // Default to 'true' if no input
    }

    workflowData.push(workflowItem);
    console.log(workflowData);
}

// Handle Save Workflow Button Click
saveButton.addEventListener('click', function() {
    localStorage.setItem('workflowData', JSON.stringify(workflowData));
    alert('Workflow saved successfully!');
});

// Handle Load Workflow Button Click
loadButton.addEventListener('click', function() {
    const savedWorkflow = localStorage.getItem('workflowData');
    if (savedWorkflow) {
        workflowData = JSON.parse(savedWorkflow);
        renderWorkflow();
    } else {
        alert('No saved workflow found!');
    }
});

// Function to render the workflow in the workflow area
function renderWorkflow() {
    workflowArea.innerHTML = ''; // Clear existing items
    workflowData.forEach((item, index) => {
        const workflowItem = document.createElement('div');
        workflowItem.classList.add('workflow-item');
        workflowItem.draggable = true; // Make the item draggable
        workflowItem.dataset.index = index; // Store its index for reordering

        switch(item.type) {
            case 'get-data':
                workflowItem.textContent = 'Get Data';
                break;
            case 'create-update-data':
                workflowItem.textContent = 'Create or Update Data';
                break;
            case 'perform-calculation':
                workflowItem.textContent = 'Perform a Calculation';
                break;
            case 'if-condition':
                workflowItem.textContent = `If: ${item.condition || ''}`;
                break;
            case 'else-if-condition':
                workflowItem.textContent = `Else If: ${item.condition || ''}`;
                break;
            case 'else-condition':
                workflowItem.textContent = `Else: ${item.condition || ''}`;
                break;
            case 'for-loop':
                workflowItem.textContent = `For Loop: ${item.iterations} iterations`;
                break;
            case 'while-loop':
                workflowItem.textContent = `While Loop: ${item.condition}`;
                break;
        }

        // Create and append the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', function() {
            deleteWorkflowItem(index);
        });

        workflowItem.appendChild(deleteButton);
        workflowArea.appendChild(workflowItem);

        // Add drag and drop event listeners
        workflowItem.addEventListener('dragstart', handleDragStart);
        workflowItem.addEventListener('dragover', handleDragOver);
        workflowItem.addEventListener('drop', handleDrop);
        workflowItem.addEventListener('dragend', handleDragEnd);
    });
}

// Drag and Drop Handlers
function handleDragStart(event) {
    dragSourceIndex = Number(event.target.dataset.index);
    event.target.style.opacity = "0.5"; // Visual feedback for dragging
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
    event.target.style.border = "2px dashed #000"; // Visual feedback for drop target
}

function handleDrop(event) {
    event.preventDefault();
    const targetIndex = Number(event.target.dataset.index);

    // Swap the positions of the dragged item and the drop target
    if (dragSourceIndex !== null && dragSourceIndex !== targetIndex) {
        const draggedItem = workflowData[dragSourceIndex];
        workflowData.splice(dragSourceIndex, 1); // Remove dragged item
        workflowData.splice(targetIndex, 0, draggedItem); // Insert at the new position
        renderWorkflow(); // Re-render the workflow with the updated order
    }
}

function handleDragEnd(event) {
    event.target.style.opacity = "1"; // Reset opacity after dragging
    event.target.style.border = ""; // Reset border style after drop
}

// Function to delete a workflow item by index
function deleteWorkflowItem(index) {
    // Remove the item from the workflowData array
    workflowData.splice(index, 1);
    // Re-render the workflow to reflect the changes
    renderWorkflow();
}

// Drag and Drop Logic for Adding New Workflow Items
const components = document.querySelectorAll('.component');

components.forEach(component => {
    component.addEventListener('dragstart', dragStart);
});

function dragStart(event) {
    event.dataTransfer.setData('componentType', event.target.dataset.type);
}

workflowArea.addEventListener('dragover', function(event) {
    event.preventDefault();
});

workflowArea.addEventListener('drop', function(event) {
    event.preventDefault();
    
    const componentType = event.dataTransfer.getData('componentType');
    saveWorkflowItem(componentType);
    
    // Create a new workflow item and render it
    const workflowItem = document.createElement('div');
    workflowItem.classList.add('workflow-item');
    
    switch(componentType) {
        case 'get-data':
            workflowItem.textContent = 'Get Data';
            break;
        case 'create-update-data':
            workflowItem.textContent = 'Create or Update Data';
            break;
        case 'perform-calculation':
            workflowItem.textContent = 'Perform a Calculation';
            break;
        case 'if-condition':
            workflowItem.textContent = 'If Statement';
            break;
        case 'else-if-condition':
            workflowItem.textContent = 'Else If Statement';
            break;
        case 'else-condition':
            workflowItem.textContent = 'Else Statement';
            break;
        case 'for-loop':
            workflowItem.textContent = 'For Loop';
            break;
        case 'while-loop':
            workflowItem.textContent = 'While Loop';
            break;
    }
    
    workflowArea.appendChild(workflowItem);
    renderWorkflow(); // Re-render the workflow to include the new item
});
