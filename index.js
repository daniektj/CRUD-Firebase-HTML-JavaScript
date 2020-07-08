const db = firebase.firestore();


const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');
const cancelar = document.getElementById('btn-cancelar');

let editStatus = false;
let id = '';

const saveTask = (title, description) =>
    db.collection('tasks').doc().set({
        title,
        description,
    });

const getTasks = () => db.collection('tasks').get();

const getTask = (id) => db.collection('tasks').doc(id).get();

const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTask = id => db.collection('tasks').doc(id).delete();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) => {
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
       querySnapshot.forEach((doc) => {
                
            const task = doc.data();
            task.id = doc.id;
                
            taskContainer.innerHTML += `<div class="sub-container-tasks">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
                <div>
                    <button class="btn btn-primary button-01 btn-delete" data-id="${task.id}">Borrar</button>
                    <button class="btn btn-secondary button-02 btn-edit" data-id="${task.id}">Editar</button>
                </div>
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await deleteTask(e.target.dataset.id)
                })
            });

            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTask(e.target.dataset.id);
                    console.log(doc.data());

                    editStatus = true;
                    id = doc.id;

                    const task = doc.data();
                    taskForm['task-title'].value = task.title;
                    taskForm['task-description'].value = task.description;
                    taskForm['btn-task-form'].innerText = 'Actualizar'

                    cancelar.innerHTML = `<button class="button-02">Cancelar</button>`;

                })
            })

        });
    });
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = taskForm["task-title"];
    const description = taskForm["task-description"];

    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Guardar';
        cancelar.innerHTML = ``
        
    }

    await getTasks();
    
    taskForm.reset();
    title.focus();
      
})

