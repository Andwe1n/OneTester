package com.qualcomm.robotcore.hardware;
import java.util.*;
/** Test-only hardware registry. No USB hardware or Android runtime is used. */
public class HardwareMap {
    private final Map<String, HardwareDevice> entries = new LinkedHashMap<>();
    public void put(String name, HardwareDevice device) { entries.put(name, device); }
    public <T> List<T> getAll(Class<T> type) {
        List<T> result = new ArrayList<>();
        for (HardwareDevice d : entries.values()) if (type.isInstance(d)) result.add(type.cast(d));
        return result;
    }
    public Set<String> getNamesOf(HardwareDevice device) {
        Set<String> names = new HashSet<>();
        for (Map.Entry<String, HardwareDevice> entry : entries.entrySet()) if (entry.getValue() == device) names.add(entry.getKey());
        return names;
    }
}
