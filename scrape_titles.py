import os
import json
from bs4 import BeautifulSoup  # type: ignore

with open("index.html") as file:
    soup = BeautifulSoup(file, "html.parser")
# Find all lesson titles, hrefs, page numbers, and chapter titles
lessons = soup.select(".lesson-title")
for lesson in lessons:
    lesson_title = lesson.get_text(strip=True)
    exercises = lesson.find_next_sibling("div", class_="lesson-exercises")
    lesson_links = exercises.find_all("a")
    for link in lesson_links:
        href = link["href"]
        title = link.get_text(strip=True)
        page_numbers = (
            (
                link.find_next_sibling(text=True)
                .strip()
                .replace("(", "")
                .replace(")", "")
            )
            if link.find_next_sibling(text=True)
            else ""
        )
        # Find the preceding h3 header class
        preceding_header = lesson.find_previous("h3")
        if preceding_header:
            sub_title_class = preceding_header.get("class", [""])[0]
            sub_title_id = preceding_header.get("id")
            sub_title = preceding_header.get_text(strip=True)
        else:
            sub_title_class = ""
            sub_title_id = ""
            sub_title = ""
        print(f"Sub Title Class: {sub_title_class}")
        print(f"Sub Title Id: {sub_title_id}")
        print(f"Sub Title: {sub_title}")
        print(f"Lesson Title: {lesson_title}")
        print(f"Link: {href}")
        print(f"Title: {title}")
        print(f"Page Numbers: {page_numbers}\n")

        # Get the last segment of the href as the file name
        file_name = href.split("/")[-2] + ".json"
        # Create the file path
        file_path = os.path.join(
            os.path.dirname(__file__), href, href.split("/")[-2] + ".json"
        )
        # Create a dictionary with the extracted data
        data = {
            "lesson_title": lesson_title,
            "link": href,
            "title": title,
            "page_numbers": page_numbers,
            "sub_title_class": sub_title_class,
            "sub_title_id": sub_title_id,
            "sub_title": sub_title,
        }
        # Write the data to a JSON file
        with open(file_path, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Data written to {file_path}\n")
