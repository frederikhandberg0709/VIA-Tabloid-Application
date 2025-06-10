package via.viatab.backend.model;

public enum Department {
    ENGINEERING("Engineering & Technology"),
    BUSINESS("Business & Management"),
    DESIGN("Design & Media"),
    HEALTH("Health Sciences");

    private final String displayName;

    Department(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
