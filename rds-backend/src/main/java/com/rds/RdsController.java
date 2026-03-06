package com.rds;

import com.rds.parser.RdsParser;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController{

    @PostMapping("/parse")
    public void parseRds(@RequestBody String rdsScript){
        RdsParser parser = new RdsParser();
        parser.parse(rdsScript);
    }
}