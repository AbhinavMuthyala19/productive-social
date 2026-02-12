package com.productive.social.exceptions.notes;



public class NotesNotFoundException extends RuntimeException {
    public NotesNotFoundException(Long notesId) {
        super("Notes not found with id: " + notesId);
    }
}
