def detect_service(description):

    text = description.lower()

    if any(word in text for word in
           ["fan", "light", "wire", "switch", "electric"]):
        return "Electrical"

    if any(word in text for word in
           ["tap", "pipe", "water", "leak", "plumb"]):
        return "Plumbing"

    if any(word in text for word in
           ["clean", "cleaning", "house", "room"]):
        return "Cleaning"

    if any(word in text for word in
           ["garden", "plant", "grass"]):
        return "Gardening"

    if any(word in text for word in
           ["computer", "laptop", "software"]):
        return "Computer"

    return "General"


def calculate_match(provider, service):

    score = 0

    # Skill match
    if provider["skill"].lower() == service.lower():
        score += 60

    # Rating
    score += min(float(provider["rating"]) * 5, 25)

    # Experience
    score += min(int(provider["experience"]), 10)

    # Availability
    if provider["availability"].lower() == "available":
        score += 5

    return round(min(score, 100), 1)