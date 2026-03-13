package com.rds;

import com.rds.datastructure.GraphManager;
import com.rds.parser.RdsParser;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RdsController {

    @PostMapping(value = "/parse", consumes = "text/plain")
    public GraphManager parseRds(@RequestBody String rdsScript) {
        RdsParser parser = new RdsParser();
        return parser.parse(rdsScript);
    }
}