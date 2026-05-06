package com.rds.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ParseException.class)
    public ResponseEntity<?> handleParseException(ParseException e) {
        return ResponseEntity.badRequest().body(
                Map.of(
                        "code", "PARSE_ERROR",
                        "message", e.getMessage(),
                        "line", e.getLine()
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e) {
        return ResponseEntity.status(500).body(
                Map.of(
                        "code", "INTERNAL_ERROR",
                        "message", "Something went wrong in the server"
                )
        );
    }

}
