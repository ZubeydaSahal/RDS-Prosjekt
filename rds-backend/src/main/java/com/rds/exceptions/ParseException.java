package com.rds.exceptions;

public class ParseException extends RuntimeException {
    private final int line; // Linenumber to be sent to UI

    public ParseException(String message) {
        super(message);
        this.line = -1;  // return -1 if line is unknown
    }

    public ParseException(String message, int line) {
        super(message);
        this.line = line;
    }

    public int getLine() {
        return line;
    }
}