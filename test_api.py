import requests
import json
import time

BASE_URL = "http://localhost:8000/api/projects"

def test_api():
    print("Testing API...")
    
    # 1. Create Project with Scaffold Data
    project_name = f"test_scaffold_{int(time.time())}"
    payload = {
        "name": project_name,
        "description": "Test Project",
        "architecture_content": "# Test Architecture",
        "microarchitecture_content": '{"test": "data"}',
        "rtl_content": "// Test RTL"
    }
    
    try:
        print(f"Creating project {project_name}...")
        response = requests.post(BASE_URL + "/", json=payload)
        response.raise_for_status()
        print("Project created successfully.")
    except Exception as e:
        print(f"Failed to create project: {e}")
        return

    # 2. Verify Architecture Content
    try:
        print("Verifying architecture content...")
        response = requests.get(f"{BASE_URL}/{project_name}/files/architecture.md")
        response.raise_for_status()
        data = response.json()
        if data["content"] == "# Test Architecture":
            print("Architecture content verified.")
        else:
            print(f"Architecture content mismatch: {data['content']}")
    except Exception as e:
        print(f"Failed to get architecture content: {e}")

    # 3. Verify Microarchitecture Content
    try:
        print("Verifying microarchitecture content...")
        response = requests.get(f"{BASE_URL}/{project_name}/files/microarchitecture.json")
        response.raise_for_status()
        data = response.json()
        if data["content"] == '{"test": "data"}':
            print("Microarchitecture content verified.")
        else:
            print(f"Microarchitecture content mismatch: {data['content']}")
    except Exception as e:
        print(f"Failed to get microarchitecture content: {e}")

    # 4. Update Architecture Content
    try:
        print("Updating architecture content...")
        new_content = "# Updated Architecture"
        response = requests.put(f"{BASE_URL}/{project_name}/files/architecture.md", json={"content": new_content})
        response.raise_for_status()
        print("Architecture content updated.")
        
        # Verify update
        response = requests.get(f"{BASE_URL}/{project_name}/files/architecture.md")
        data = response.json()
        if data["content"] == new_content:
            print("Update verified.")
        else:
            print(f"Update verification failed: {data['content']}")
    except Exception as e:
        print(f"Failed to update architecture content: {e}")

if __name__ == "__main__":
    test_api()
