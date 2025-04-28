document.addEventListener("DOMContentLoaded", () => {
    initApp()
  })
  
  // zmienne do przechowywania danych
  const appData = {
    student: {
      imie: "",
      nazwisko: "",
      klasa: "",
      rokSzkolny: "",
      miejsce: "",
      dataRozpoczecia: "",
      dataZakonczenia: "",
    },
    totalHours: 140, // liczba godzin do realizacji
    completedHours: 0, // liczba godzin zrealizowanych
    activities: [], // tablica aktywności
    topics: {
      // działy i tematy
      "Moduł wstępny": [
        { name: "Czynności wstępne i szkolenia, struktura i organizacja pracy informatyków", hours: 0, totalHours: 0 },
        { name: "Struktura organizacyjna przedsiębiorstwa i elementy przetwarzania informacji", hours: 0, totalHours: 0 },
        { name: "Konfiguracja sprzętu komputerowego i oprogramowania", hours: 0, totalHours: 0 },
      ],
      "Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego": [
        { name: "Montaż sprzętu komputerowego", hours: 0, totalHours: 0 },
        { name: "Naprawa sprzętu komputerowego", hours: 0, totalHours: 0 },
        { name: "Konserwacja i obsługa sprzętu komputerowego", hours: 0, totalHours: 0 },
      ],
      "Systemy informatyczne": [
        { name: "Zasady administrowania systemami informatycznymi i archiwizowania danych", hours: 0, totalHours: 0 },
        { name: "Dokumentacja technologiczna przetwarzania informacji", hours: 0, totalHours: 0 },
        { name: "Biblioteki oprogramowania i zbiorów danych", hours: 0, totalHours: 0 },
        { name: "Zapoznanie z programami do administracji lokalnymi sieciami komputerowymi", hours: 0, totalHours: 0 },
        { name: "Obsługa programów używanych w przedsiębiorstwie", hours: 0, totalHours: 0 },
        { name: "Komputerowe wspomaganie procesów projektowania", hours: 0, totalHours: 0 },
        {
          name: "Organizacja, zbieranie i kontrola danych, przetwarzanie i wykorzystywanie wyników",
          hours: 0,
          totalHours: 0,
        },
        {
          name: "Elementy procesów projektowania, programowania i uruchamiania programów komputerowych",
          hours: 0,
          totalHours: 0,
        },
        { name: "Ochrona danych i procesów przetwarzania", hours: 0, totalHours: 0 },
      ],
      "Tworzenie aplikacji internetowych": [
        { name: "Konfiguracja serwerów i przeglądarek pod obsługę aplikacji internetowych", hours: 0, totalHours: 0 },
        { name: "Struktura witryny internetowej - HTML", hours: 0, totalHours: 0 },
        { name: "Stylizacja elementów witryny - CSS", hours: 0, totalHours: 0 },
        { name: "Programowanie aplikacji internetowych - JS, PHP", hours: 0, totalHours: 0 },
        { name: "Testowanie aplikacji internetowych", hours: 0, totalHours: 0 },
      ],
    },
  }
  
  function initApp() {
    console.log("Inicjalizacja aplikacji...")
  
    // przyciski nawigacji
    document.getElementById("btn-metryczka").addEventListener("click", () => showSection("metryczka"))
    document.getElementById("btn-dziennik").addEventListener("click", () => showSection("dziennik"))
    document.getElementById("btn-podsumowanie").addEventListener("click", () => showSection("podsumowanie"))
  
    // formularz
    document.getElementById("student-form").addEventListener("submit", handleStudentFormSubmit)
    document.getElementById("activity-form").addEventListener("submit", handleActivityFormSubmit)
  
    // przyciski forma
    document.getElementById("btn-edit-dane").addEventListener("click", () => showSection("metryczka"))
    document.getElementById("btn-wyczysc").addEventListener("click", clearActivityForm)
  
    // lista tematów
    const dzialSelect = document.getElementById("dzial")
    dzialSelect.addEventListener("change", updateTopicOptions)
  
    // Najpierw wczytaj dane, potem aktualizuj interfejs
    loadAppData()
    updateTopicOptions()
    updateUI()
  
    console.log("Aplikacja zainicjalizowana")
  }
  
  function showSection(sectionId) {
    // dodanie klas hidden w sekcjach
    document.getElementById("metryczka").classList.add("hidden")
    document.getElementById("dane-ucznia").classList.add("hidden")
    document.getElementById("dziennik").classList.add("hidden")
    document.getElementById("podsumowanie").classList.add("hidden")
    document.getElementById("zrealizowane-tematy").classList.add("hidden")
  
    document.getElementById("btn-metryczka").classList.remove("active")
    document.getElementById("btn-dziennik").classList.remove("active")
    document.getElementById("btn-podsumowanie").classList.remove("active")
  
    if (sectionId === "metryczka") {
      document.getElementById("metryczka").classList.remove("hidden")
      document.getElementById("btn-metryczka").classList.add("active")
  
      // wypełnienie formularza danymi
      if (appData.student.imie) {
        document.getElementById("imie").value = appData.student.imie
        document.getElementById("nazwisko").value = appData.student.nazwisko
        document.getElementById("klasa").value = appData.student.klasa
        document.getElementById("rok-szkolny").value = appData.student.rokSzkolny
        document.getElementById("miejsce").value = appData.student.miejsce
        document.getElementById("data-rozpoczecia").value = appData.student.dataRozpoczecia
        document.getElementById("data-zakonczenia").value = appData.student.dataZakonczenia
      }
    } else if (sectionId === "dziennik") {
      if (appData.student.imie) {
        document.getElementById("dane-ucznia").classList.remove("hidden")
        document.getElementById("dziennik").classList.remove("hidden")
        document.getElementById("btn-dziennik").classList.add("active")
        updateTopicsList()
        updateRemainingHours()
      } else {
        alert("Najpierw wprowadź dane ucznia!")
        showSection("metryczka")
      }
    } else if (sectionId === "podsumowanie") {
      if (appData.student.imie) {
        document.getElementById("dane-ucznia").classList.remove("hidden")
        document.getElementById("podsumowanie").classList.remove("hidden")
        document.getElementById("zrealizowane-tematy").classList.remove("hidden")
        document.getElementById("btn-podsumowanie").classList.add("active")
        updateSummary()
        updateCompletedTopics()
      } else {
        alert("Najpierw wprowadź dane ucznia!")
        showSection("metryczka")
      }
    }
  }
  
  function handleStudentFormSubmit(event) {
    event.preventDefault()
  
    // pobranie danych z formularza
    appData.student.imie = document.getElementById("imie").value
    appData.student.nazwisko = document.getElementById("nazwisko").value
    appData.student.klasa = document.getElementById("klasa").value
    appData.student.rokSzkolny = document.getElementById("rok-szkolny").value
    appData.student.miejsce = document.getElementById("miejsce").value
    appData.student.dataRozpoczecia = document.getElementById("data-rozpoczecia").value
    appData.student.dataZakonczenia = document.getElementById("data-zakonczenia").value
  
    // sprawdzenie czy wszystkie pola formularza są wypełnione
    if (
      !appData.student.imie ||
      !appData.student.nazwisko ||
      !appData.student.klasa ||
      !appData.student.rokSzkolny ||
      !appData.student.miejsce ||
      !appData.student.dataRozpoczecia ||
      !appData.student.dataZakonczenia
    ) {
      alert("Proszę wypełnić wszystkie pola formularza!")
      return
    }
  
    // zapis danych do localStorage
    saveAppData()
    console.log("Dane ucznia zapisane do localStorage")
  
    // aktualizacja interfejsa i przejście do sekcji dziennika
    updateStudentInfo()
    showSection("dziennik")
  }
  
  function handleActivityFormSubmit(event) {
    event.preventDefault()
  
    // pobranie wartości z formularza
    const dataZajec = document.getElementById("data-zajec").value
    const dzial = document.getElementById("dzial").value
    const temat = document.getElementById("temat").value
  
    // pobranie wybranego opiekuna
    let opiekun = ""
    const opiekunElements = document.getElementsByName("opiekun")
    for (const element of opiekunElements) {
      if (element.checked) {
        opiekun = element.value
        break
      }
    }
  
    const sprawozdanie = document.getElementById("sprawozdanie").value
    const zrealizowano = document.getElementById("zrealizowano").checked
    const ileGodzin = Number.parseInt(document.getElementById("ile-godzin").value)
    const stopienOpanowania = Number.parseInt(document.getElementById("stopien-opanowania").value)
  
    if (!dataZajec || !dzial || !temat || !opiekun || !sprawozdanie || isNaN(ileGodzin) || ileGodzin <= 0) {
      alert("Wypełnij wszystkie pola formularza!")
      return
    }
  
    const activity = {
      dataZajec,
      dzial,
      temat,
      opiekun,
      sprawozdanie,
      zrealizowano,
      ileGodzin,
      stopienOpanowania,
    }
  
    // dodaj aktywność do listy
    appData.activities.push(activity)
  
    // aktualizacja godzin dla tematu
    for (const topic of appData.topics[dzial]) {
      if (topic.name === temat) {
        topic.hours += ileGodzin
        topic.totalHours += ileGodzin
        break
      }
    }
  
    // aktualizacja zrealizowanych godzin
    appData.completedHours += ileGodzin
  
    // zapis zaktualizowanych danych
    saveAppData()
    console.log("Aktywność dodana i zapisana do localStorage")
  
    updateRemainingHours()
    updateTopicsList()
    clearActivityForm()
  
    alert("Zajęcia zostały dodane!")
  }
  
  function updateStudentInfo() {
    // formatowanie dat
    const startDate = formatDate(appData.student.dataRozpoczecia)
    const endDate = formatDate(appData.student.dataZakonczenia)
  
    // aktualizacja informacji o uczniu
    document.getElementById("display-imie-nazwisko").textContent = `${appData.student.imie} ${appData.student.nazwisko}`
    document.getElementById("display-klasa").textContent = appData.student.klasa
    document.getElementById("display-rok-szkolny").textContent = appData.student.rokSzkolny
    document.getElementById("display-miejsce").textContent = appData.student.miejsce
    document.getElementById("display-data-rozpoczecia").textContent = startDate
    document.getElementById("display-data-zakonczenia").textContent = endDate
  }
  
  function updateTopicOptions() {
    const dzial = document.getElementById("dzial").value
    const tematSelect = document.getElementById("temat")
  
    // czyszcenie opcji w liście tematów
    tematSelect.innerHTML = ""
  
    appData.topics[dzial].forEach((topic) => {
      const option = document.createElement("option")
      option.value = topic.name
      option.textContent = topic.name
      tematSelect.appendChild(option)
    })
  }
  
  function updateTopicsList() {
    const topicsList = document.getElementById("topics-list")
    topicsList.innerHTML = ""
  
    for (const [dzial, topics] of Object.entries(appData.topics)) {
      const dzialElement = document.createElement("div")
      dzialElement.innerHTML = `<h3 class="module-title">${dzial}</h3>`
  
      topics.forEach((topic) => {
        const topicElement = document.createElement("div")
        topicElement.className = "topic-item"
  
        // ustawienie klasy dla godzin w zależności czy temat ma zrealizowane godziny
        const hoursClass = topic.hours > 0 ? "topic-hours completed" : "topic-hours"
  
        topicElement.innerHTML = `
                  <span>${topic.name}</span>
                  <span class="${hoursClass}">${topic.hours} godz.</span>
              `
  
        dzialElement.appendChild(topicElement)
      })
  
      topicsList.appendChild(dzialElement)
    }
  }
  
  function updateRemainingHours() {
    // liczenie i wyświetlanie pozostałych godzin
    const remainingHours = appData.totalHours - appData.completedHours
    document.getElementById("remaining-hours").textContent = remainingHours
  }
  
  function updateSummary() {
    const summaryContent = document.getElementById("summary-content")
  
    // Podsumowanie
    const summaryHTML = `
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda autem nulla doloribus dolor sed. Non reiciendis aspernatur possimus reprehenderit, sint itaque autem hic porro eum dolores maxime delectus cum officiis officia quidem totam eaque. Tempore quaerat delectus perspiciatis beatae temporibus reiciendis earum animi nesciunt voluptas, sunt consectetur non rerum eveniet optio nemo ipsa rem enim.</p>
          <p>Cum dolorum int aspernatur laudantium exercitationem rerum dolorem ratione necessitatibus delectus ipsum nisi. Alias tenetur, esse necessitatibus distinctio accusamus aperiam eaque nobis vitae id maxime enim repellat veniam.</p>
          <p>Eveniet porro soluta cupiditate animi cumque est quas dolorem atque facilis incidunt nihil, atemptum modestiae esse quaerat.</p>
         
          <table>
              <tr>
                  <th>Nazwa modułu</th>
                  <th>Ilość godzin zrealizowanych</th>
              </tr>
              <tr>
                  <td>Moduł wstępny</td>
                  <td id="summary-module1">0</td>
              </tr>
              <tr>
                  <td>Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego</td>
                  <td id="summary-module2">0</td>
              </tr>
              <tr>
                  <td>Systemy informatyczne</td>
                  <td id="summary-module3">0</td>
              </tr>
              <tr>
                  <td>Tworzenie aplikacji internetowych</td>
                  <td id="summary-module4">0</td>
              </tr>
              <tr class="total-row">
                  <td>RAZEM:</td>
                  <td id="summary-total">0</td>
              </tr>
          </table>
         
          <div class="grade">
              <p>Pozostało do zrealizowania: <span id="summary-remaining">140</span> godz.</p>
              <p>Proponowana ocena: (<span id="summary-grade-value">2</span>) <span id="summary-grade-text" class="highlight">dopuszczający</span></p>
          </div>
      `
  
    summaryContent.innerHTML = summaryHTML
  
    // aktualizacja podsumowania z danymi
    const moduleHours = [0, 0, 0, 0]
    let moduleIndex = 0
  
    // liczenie godzin dla działów
    for (const [dzial, topics] of Object.entries(appData.topics)) {
      let moduleTotal = 0
  
      topics.forEach((topic) => {
        moduleTotal += topic.hours
      })
  
      moduleHours[moduleIndex] = moduleTotal
      moduleIndex++
    }
  
    // aktualizacja wyświetlanych godzin dla modułu
    document.getElementById("summary-module1").textContent = moduleHours[0]
    document.getElementById("summary-module2").textContent = moduleHours[1]
    document.getElementById("summary-module3").textContent = moduleHours[2]
    document.getElementById("summary-module4").textContent = moduleHours[3]
  
    // liczba wszystkich godzin
    const totalHours = moduleHours.reduce((sum, hours) => sum + hours, 0)
    document.getElementById("summary-total").textContent = totalHours
  
    // pozostałe godziny
    const remainingHours = appData.totalHours - totalHours
    document.getElementById("summary-remaining").textContent = remainingHours
  
    let totalGrade = 0
    let gradesCount = 0
  
    if (appData.activities.length > 0) {
      // suma ocen
      appData.activities.forEach((activity) => {
        totalGrade += activity.stopienOpanowania
        gradesCount++
      })
  
      // średnia ocen
      const averageGrade = totalGrade / gradesCount
  
      // zaokrąglanie średniej
      const roundedGrade = Math.round(averageGrade)
  
      // opis oceny
      let gradeText = ""
      switch (roundedGrade) {
        case 1:
          gradeText = "niedostateczny"
          break
        case 2:
          gradeText = "dopuszczający"
          break
        case 3:
          gradeText = "dostateczny"
          break
        case 4:
          gradeText = "dobry"
          break
        case 5:
          gradeText = "bardzo dobry"
          break
        case 6:
          gradeText = "celujący"
          break
        default:
          gradeText = "dopuszczający"
      }
  
      // wyświetlanie oceny
      document.getElementById("summary-grade-value").textContent = roundedGrade
      document.getElementById("summary-grade-text").textContent = gradeText
    } else {
      document.getElementById("summary-grade-value").textContent = "2"
      document.getElementById("summary-grade-text").textContent = "dopuszczający"
    }
  }
  
  function updateCompletedTopics() {
    const completedTopicsEl = document.getElementById("completed-topics")
  
    if (appData.activities.length === 0) {
      completedTopicsEl.innerHTML = "<p>Brak zrealizowanych tematów</p>"
      return
    }
  
    completedTopicsEl.innerHTML = ""
  
    // dodawanie do listy zrealizowanych tematów
    appData.activities.forEach((activity) => {
      const activityDiv = document.createElement("div")
      activityDiv.className = "completed-topic"
  
      activityDiv.innerHTML = `
        <p>dział: <span class="highlight">${activity.dzial}</span></p>
        <p>temat: <span class="highlight">${activity.temat}</span></p>
        <p>opiekun: <span class="highlight">${activity.opiekun}</span>, data realizacji: <span class="highlight">${formatDate(activity.dataZajec)}</span>, ilość godzin: <span class="highlight">${activity.ileGodzin}</span>, ocena: <span class="highlight">${activity.stopienOpanowania}</span></p>
        <div class="completed-topic-report">${activity.sprawozdanie}</div>
      `
  
      completedTopicsEl.appendChild(activityDiv)
    })
  }
  
  function clearActivityForm() {
    // domyślna data = dzisiaj
    document.getElementById("data-zajec").valueAsDate = new Date()
    // reset wyboru działu
    document.getElementById("dzial").selectedIndex = 0
    // aktualizacja listy tematów dla działu
    updateTopicOptions()
    // czyszczenie sprawozdania
    document.getElementById("sprawozdanie").value = ""
    // odznaczenie pola zrealizowano
    document.getElementById("zrealizowano").checked = false
    // czyszczenie pola godzin
    document.getElementById("ile-godzin").value = ""
    // stopień opanowania
    document.getElementById("stopien-opanowania").value = 1
  
    // czyszczenie wyboru opiekuna
    const opiekunElements = document.getElementsByName("opiekun")
    for (const element of opiekunElements) {
      element.checked = false
    }
  }
  
  function formatDate(dateString) {
    // jak brak daty to zwróć pusty ciąg
    if (!dateString) return ""
  
    const date = new Date(dateString)
    // formatowanie dnia, miesiąca i roku
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
  
    // zwrot sformatowanej daty
    return `${day}-${month}-${year}`
  }
  
  // funkcja zapisująca dane do localStorage
  function saveAppData() {
    try {
      const dataToSave = JSON.stringify(appData)
      localStorage.setItem("dziennikPraktykiData", dataToSave)
      console.log("Dane zapisane do localStorage:", dataToSave)
  
      // Sprawdzenie czy dane zostały zapisane
      const savedData = localStorage.getItem("dziennikPraktykiData")
      if (savedData) {
        console.log("Weryfikacja zapisu - dane obecne w localStorage")
      } else {
        console.error("Błąd: Dane nie zostały zapisane w localStorage")
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania danych do localStorage:", error)
    }
  }
  
  // funkcja wczytująca dane z localStorage
  function loadAppData() {
    try {
      const savedData = localStorage.getItem("dziennikPraktykiData")
      console.log("Próba wczytania danych z localStorage")
  
      if (savedData) {
        console.log("Znaleziono dane w localStorage:", savedData)
        const parsedData = JSON.parse(savedData)
  
        // aktualizacja appData danymi
        appData.student = parsedData.student || appData.student
        appData.totalHours = parsedData.totalHours || appData.totalHours
        appData.completedHours = parsedData.completedHours || appData.completedHours
        appData.activities = parsedData.activities || appData.activities
  
        // aktualizacja tematów danymi
        if (parsedData.topics) {
          appData.topics = parsedData.topics
        }
  
        console.log("Dane wczytane z localStorage")
      } else {
        console.log("Brak zapisanych danych w localStorage")
      }
    } catch (error) {
      console.error("Błąd podczas wczytywania danych z localStorage:", error)
    }
  }
  
  function updateUI() {
    // jeśli są dane ucznia, aktualizuj interfejs
    if (appData.student && appData.student.imie) {
      console.log("Aktualizacja interfejsu z danymi ucznia:", appData.student.imie)
      updateStudentInfo()
      updateRemainingHours()
    } else {
      console.log("Brak danych ucznia do wyświetlenia")
    }
  }
  
  // przycisk do czyszczenia danych
  function addClearDataButton() {
    const footer = document.querySelector("footer")  
  
    const clearButton = document.createElement("button")
    clearButton.textContent = "Wyczyść wszystkie dane"
    clearButton.className = "clear-data-button"
    clearButton.style.backgroundColor = "#f44336"
    clearButton.style.marginTop = "20px"  
    
    clearButton.addEventListener("click", () => {
      if (confirm("Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.")) {
        localStorage.removeItem("dziennikPraktykiData")
        alert("Dane zostały usunięte. Strona zostanie odświeżona.")
        location.reload()
      }
    })  
    
    footer.insertBefore(clearButton, footer.firstChild)
  }

  document.addEventListener("DOMContentLoaded", addClearDataButton)
  