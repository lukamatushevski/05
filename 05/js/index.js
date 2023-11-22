const checkLang = () => {
    const defaultLang = "ka";
    let currentLang = getData("lang") || defaultLang;
    setData("lang", currentLang);
    return currentLang;
  }
  
  const changeLang = () => {
    const currentLang = getData("lang");
    const newLang = currentLang === "ka" ? "en" : "ka";
    setData("lang", newLang);
    generateLangs();
  }
  
  const addNewEntry = () => {
    const elementID = document.getElementById("elementID");
    const submitButton = document.getElementById("submitNewEntry");
    const lang = langs[checkLang()];
  
    submitButton.innerText = elementID.value ? lang.editEntry : lang.submitNewEntry;
  
    const newEntryModal = document.getElementById("newEntryModal");
    document.body.classList.add("modal-open");
    newEntryModal.style.display = "flex";
  }
  
  const closeModal = () => {
    let newEntryModal = document.getElementById("newEntryModal");
    let newEntryTitle = document.getElementById("newEntryTitle");
    let newEntryContent = document.getElementById("newEntryContent");
    let elementID = document.getElementById("elementID");
    document.body.classList.remove("modal-open");
    newEntryModal.style.display = "none";
    newEntryTitle.value = "";
    newEntryContent.value = "";
    elementID.value = "";
  }
  
  
  const generateID = () => {
    const entries = getData("entries") || [];
    const sortedEntries = entries.slice().sort((a, b) => a.id - b.id);
    return sortedEntries.length ? sortedEntries[sortedEntries.length - 1].id + 1 : 1;
  }
  
  const submitNewEntry = () => {
    const elementID = document.getElementById("elementID");
    const newEntryTitle = document.getElementById("newEntryTitle");
    const newEntryContent = document.getElementById("newEntryContent");
    const date = new Date();
    const id = generateID();
    const timestamp = date.getTime() / 1000;
    const formattedDate = `${timestamp}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
    if (elementID.value) {
      return submitEditedEntry();
    }
  
    const data = { id, date: formattedDate, title: newEntryTitle.value, content: newEntryContent.value };
    const entries = existsData("entries") ? getData("entries") : [];
    entries.push(data);
    setData("entries", entries);
    processHTMLForEntry(data);
    newEntryTitle.value = "";
    newEntryContent.value = "";
    closeModal();
  }
  
  const submitEditedEntry = () => {
    let entries = getData("entries");
    let elementID = document.getElementById("elementID");
    let newEntryTitle = document.getElementById("newEntryTitle");
    let newEntryContent = document.getElementById("newEntryContent");
    let date = new Date();
    let data = {
      id: parseInt(elementID.value),
      date: (date.getTime() / 1000) + "/" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
      title: newEntryTitle.value,
      content: newEntryContent.value,
    }
    let newEntries = entries.map((entry) => {
      if (entry.id === data.id) {
        return data;
      }
      return entry;
    });
    setData("entries", newEntries);
    let entryContainer = document.getElementById("entry-" + data.id);
    let entryTitle = entryContainer.getElementsByClassName("entry-title")[0];
    let entryContent = entryContainer.getElementsByClassName("entry-content")[0];
    entryTitle.innerText = data.title;
    entryContent.innerText = data.content;
    elementID.value = "";
    newEntryTitle.value = "";
    newEntryContent.value = "";
    closeModal();
  }
  
  const deleteEntry = (id) => {
    let entries = getData("entries");
    let newEntries = entries.filter((entry) => entry.id !== id);
    setData("entries", newEntries);
    let entryContainer = document.getElementById("entry-" + id);
    entryContainer.remove();
  }
  
  const editEntry = (id) => {
    let entries = getData("entries");
    if (entries) {
      let entry = entries.find((entry) => entry.id === id);
      if (entry) {
        let newEntryTitle = document.getElementById("newEntryTitle");
        let newEntryContent = document.getElementById("newEntryContent");
        let elementID = document.getElementById("elementID");
        newEntryTitle.value = entry.title;
        newEntryContent.value = entry.content;
        elementID.value = id;
        addNewEntry();
      }
    }
  }
  
  const processHTMLElement = (typeOf, className, params) => {
    let HTMlelement = document.createElement(typeOf);
    HTMlelement.classList.add(className);
    if (params) {
      if (params.id) {
        HTMlelement.id = params.id;
      }
      if (params.innerText) {
        HTMlelement.innerText = params.innerText;
      }
      if (params.src) {
        HTMlelement.src = params.src;
      }
      if (params.onclick) {
        HTMlelement.setAttribute("onclick", params.onclick);
      }
    }
    return HTMlelement;
  }
  
  const processHTMLForEntry = (entry) => {
    let entriesContainer = document.getElementById("entries");
    let entryContainer = processHTMLElement("div", "entry", {
      id: "entry-" + entry.id
    });
    let entryWrapper = processHTMLElement("div", "entry-wrapper");
    let entryTitle = processHTMLElement("div", "entry-title", {
      innerText: entry.title
    });
    let entryContent = processHTMLElement("div", "entry-content", {
      innerText: entry.content
    });
    let entryActions = processHTMLElement("div", "entry-actions");
    let entryDelete = processHTMLElement("img", "entry-delete", {
      src: "images/delete.svg",
      onclick: "deleteEntry(" + entry.id + ")"
    });
    let entryEdit = processHTMLElement("img", "entry-edit", {
      src: "images/edit.svg",
      onclick: "editEntry(" + entry.id + ")"
    });
    entryActions.appendChild(entryDelete);
    entryActions.appendChild(entryEdit);
    entryWrapper.appendChild(entryTitle);
    entryWrapper.appendChild(entryContent);
    entryContainer.appendChild(entryWrapper);
    entryContainer.appendChild(entryActions);
    entriesContainer.appendChild(entryContainer);
  }
  
  const generateEntries = () => {
    let entries = getData("entries");
    let entriesContainer = document.getElementById("entries");
    if (entries) {
      entriesContainer.innerHTML = "";
      entries.forEach((entry) => {
        processHTMLForEntry(entry);
      });
    }
  }
  
  const generateLangs = () => {
    const lang = checkLang();
    const elements = {
      addNewEntry: "addNewEntry",
      newEntryTitle: "newEntryTitle",
      newEntryContent: "newEntryContent",
      submitNewEntry: "submitNewEntry",
      changeLang: "changeLang",
      closeModal: "closeModal",
    };
  
    for (const element of Object.keys(elements)) {
      const elementNode = document.getElementById(elements[element]);
      switch (element) {
        case "addNewEntry":
          elementNode.innerText = langs[lang].addNewEntry;
          break;
        case "newEntryTitle":
          elementNode.setAttribute("placeholder", langs[lang].newEntryTitle);
          break;
        case "newEntryContent":
          elementNode.setAttribute("placeholder", langs[lang].newEntryContent);
          break;
        case "submitNewEntry":
          elementNode.innerText = langs[lang].submitNewEntry;
          break;
        case "changeLang":
          elementNode.innerText = lang === "ka" ? "en" : "ka";
          break;
        case "closeModal":
          elementNode.innerText = langs[lang].closeModal;
          break;
      }
    }
  }
  const general = () => {
    generateLangs();
    generateEntries();
  }
  
  general();