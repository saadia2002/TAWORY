from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialiser le navigateur Edge
driver = webdriver.Edge()  # Utiliser Edge

try:
    # Ouvrir l'application web
    driver.get("http://localhost:3000/users")  # Remplacez par l'URL de votre application

    # Attendre et remplir le formulaire pour créer un nouvel utilisateur
    WebDriverWait(driver, 90).until(EC.presence_of_element_located((By.XPATH, "//input[@label='User Name']"))).send_keys("Test User")
    driver.find_element(By.XPATH, "//input[@label='Email']").send_keys("testuser@example.com")
    driver.find_element(By.XPATH, "//input[@label='Password']").send_keys("password123")
    driver.find_element(By.XPATH, "//input[@label='Role']").send_keys("Admin")
    driver.find_element(By.XPATH, "//input[@type='date']").send_keys("1990-01-01")

    # Charger le fichier (vérifiez que le chemin est correct)
    driver.find_element(By.XPATH, "//input[@type='file']").send_keys("C:\\Users\\amalo\\Downloads\\TAWORY-hind\\TAWORY-hind\\admin-frontend\\public\\apple-icon.png")

    # Soumettre le formulaire
    driver.find_element(By.XPATH, "//button[contains(text(), 'Create User')]").click()

    # Attendre la présence du tableau et vérifier que l'utilisateur a été ajouté
    users_table = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//table")))
    assert "Test User" in users_table.text, "L'utilisateur n'a pas été trouvé dans la table."

    # Ajouter une pause pour que la page reste ouverte
    input("Appuyez sur Entrée pour fermer le navigateur...")

finally:
    # Fermer le navigateur
    driver.quit()
