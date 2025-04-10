let nextNoteId = 0;
let editNoteId = null;

document.addEventListener('DOMContentLoaded', () => {
    const offlineNotice = document.getElementById('offline');
    window.addEventListener('online', () => offlineNotice.style.display = 'none');
    window.addEventListener('offline', () => offlineNotice.style.display = 'block');

    loadNotes();
});

//получить заметки из локал сторадж
function getFromStorage() {
    let notes = localStorage.getItem('notes');
    try {
        return notes ? JSON.parse(notes) : [];
    } catch (error) {
        console.error("Error parsing notes from localStorage:", error);
        return [];
    }
}
//добавить заметку в локал сторадж
function addToStorage(noteObj){
    let notes = getFromStorage()
    notes.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(notes));
}
//загрузка всех заметок
function loadNotes(){
    const notes = getFromStorage();
    notes.forEach(showNote);
}
//удаление заметки из локал сторадж
function removeFromStorage(noteId)
{
    let notes = getFromStorage()
    notes = notes.filter(note => note.noteId != noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
}

//добавление заметки / редактирование
document.getElementById("addNote").addEventListener('submit', event => {
    event.preventDefault();
    const noteText = document.getElementById('note').value;
    const noteName = document.getElementById('noteName').value;
    const shortText = noteText.length > 80 ? `${noteText.substring(0, 80)}...` : noteText;
    const noteId = ++nextNoteId;

    if (editNoteId) {
        updateNote(editNoteId, noteName, noteText);
        editNoteId = null;
    } else {
        //объект, который сохраним в локал сторадж
        const noteObj = {
            noteId,
            noteName,
            noteText,
            shortText
        };
        addToStorage(noteObj);
        showNote(noteObj);
    }

    document.getElementById('note').value = '';
    document.getElementById('noteName').value = '';
});

//отображение карточки заметки
function showNote(note){
    const notesDiv = document.getElementById('notes');
    const newNote = document.createElement('div');
    newNote.classList.add('noteCard');
    newNote.dataset.noteId = note.noteId;
    newNote.innerHTML = `
        <div class='content'>
            <h2>${note.noteName}</h2>
            <p class="short">${note.shortText}</p>
            <p class="full">${note.noteText}</p>
            <button class="editNote">Редактировать</button>

        </div>
        <button class="deleteNote">Удалить</button>
    `;
    notesDiv.appendChild(newNote);

    newNote.addEventListener('click', () => {
        newNote.classList.toggle('active');
    });

}

function updateNote(id, name, text){
    let notes = getFromStorage();
    let index = notes.findIndex(note => note.noteId == id);
    if (index >= 0){
        notes[index].noteName = name;
        notes[index].noteText = text;
        notes[index].shortText = text.length > 80 ? `${text.substring(0, 80)}...` : text;
        localStorage.setItem('notes', JSON.stringify(notes));
        const notesDiv = document.getElementById('notes');
        notesDiv.innerHTML = '';
        loadNotes();
    }

}

document.getElementById('notes').addEventListener('click', function(event) {
    if (event.target && event.target.matches('.deleteNote')){
        let noteCard = event.target.closest('.noteCard');
        let noteId = noteCard.dataset.noteId;
        removeFromStorage(noteId);
        noteCard.remove();
    }
    if (event.target && event.target.matches('.editNote')){
        let noteCard = event.target.closest('.noteCard');
        let noteId = noteCard.dataset.noteId;
        let noteName = noteCard.querySelector('h2').textContent;
        let noteText = noteCard.querySelector('.full').textContent;

        document.getElementById('note').value = noteText;
        document.getElementById('noteName').value = noteName;

        editNoteId = noteId;
    }

});





