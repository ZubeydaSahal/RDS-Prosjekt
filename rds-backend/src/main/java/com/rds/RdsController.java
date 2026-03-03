package com.rds;

import com.rds.datastructure.DataStructure;
import com.rds.parser.Parser;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "")

public class RdsController{

    @PostMapping("/parse")
    public DataStructure parseRds(@RequestBody String rdsScript){
        Parser parser = new Parser();
        return parser.parse(rdsScript);
    }
}