package com.rds.datastructure;

import java.util.Map;

public class Filter {
    private String script;  //RDS text from user input
    private Map<String, Boolean> filters;  //wich relations to show or exclude
    private Map<String, Boolean> aspectFilters;  // which aspects to show or exclude
    
    
    public String getScript() {
        return script;
    }
    public void setScript(String script) {
        this.script = script;
    }

    public Map<String, Boolean> getFilters() {
        return filters;
    }
    public void setFilters(Map<String, Boolean> filters) {
        this.filters = filters;
    }
    public Map<String, Boolean> getAspectFilters() {
        return aspectFilters;
    }
    

}
   