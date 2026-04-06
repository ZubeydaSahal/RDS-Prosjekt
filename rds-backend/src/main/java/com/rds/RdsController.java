package com.rds;

import com.rds.datastructure.Filter;
import com.rds.datastructure.GraphManager;
import com.rds.parser.RdsParser;
import com.rds.datastructure.Relation;
import java.util.Set;

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