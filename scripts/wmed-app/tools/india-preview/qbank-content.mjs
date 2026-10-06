// Development-only original draft questions; all remain pending editorial review.
export const qbankDrafts=[
  {
    "n": "demo-hygiene:aseptic",
    "version": "draft-1",
    "banca": "Original learning demonstration",
    "especialidade": "Infection prevention",
    "tema": "Infection prevention",
    "subtemas": [
      "Hand hygiene"
    ],
    "dificuldade": "Foundational",
    "temImagem": true,
    "enunciado": "The diagram shows a clinician about to perform a clean/aseptic procedure. Which hand-hygiene moment applies immediately before this task?",
    "alternativas": {
      "A": "Before touching a patient",
      "B": "Before a clean/aseptic procedure",
      "C": "After body-fluid exposure risk",
      "D": "After touching patient surroundings"
    },
    "gabarito": "B",
    "explicacao": "The task shown identifies moment 2: clean hands before a clean/aseptic procedure. This indication is tied to the task, rather than merely entering or leaving the patient area.",
    "rationales": {
      "A": "This is moment 1 and applies before patient contact. The highlighted task is an aseptic procedure.",
      "B": "Correct: the highlighted task is the indication for moment 2.",
      "C": "This is moment 3. The question asks about the time before a procedure.",
      "D": "This is moment 5. The diagram highlights a procedure rather than contact with surroundings."
    },
    "hint": "Look at whether the highlighted action happens before or after patient contact, a procedure, or contact with the surroundings.",
    "illustration": {
      "kind": "sequence",
      "steps": [
        "Patient contact",
        "Clean/aseptic task",
        "Leave patient area"
      ],
      "highlight": 1,
      "alt": "Patient contact → Clean/aseptic task → Leave patient area. Highlighted step: Clean/aseptic task"
    },
    "provenance": {
      "rights": "original",
      "author": "2Doctor local prototype — original question and diagram"
    },
    "source": {
      "title": "WHO — Five moments for hand hygiene, moment 2",
      "url": "https://www.who.int/publications/m/item/five-moments-for-hand-hygiene-moment-2",
      "verified": "2026-10-06"
    },
    "review": {
      "status": "pending",
      "reviewer": null,
      "date": null,
      "version": "draft-1"
    }
  },
  {
    "n": "demo-hygiene:surroundings",
    "version": "draft-1",
    "banca": "Original learning demonstration",
    "especialidade": "Infection prevention",
    "tema": "Infection prevention",
    "subtemas": [
      "Hand hygiene"
    ],
    "dificuldade": "Foundational",
    "temImagem": true,
    "enunciado": "In this fictional teaching sequence, a clinician touches the bed rail without touching the patient. Which hand-hygiene moment applies after that contact?",
    "alternativas": {
      "A": "Before a clean/aseptic procedure",
      "B": "After touching a patient",
      "C": "After touching patient surroundings",
      "D": "Only after visible contamination"
    },
    "gabarito": "C",
    "explicacao": "The bed rail is part of the patient surroundings. Moment 5 applies after touching patient surroundings, including when the patient was not touched.",
    "rationales": {
      "A": "Moment 2 is before an aseptic procedure; none is depicted.",
      "B": "Moment 4 follows patient contact. Here only the bed rail was touched.",
      "C": "Correct: this sequence illustrates moment 5.",
      "D": "Visible contamination is not required for moment 5 to apply."
    },
    "hint": "Look at whether the highlighted action happens before or after patient contact, a procedure, or contact with the surroundings.",
    "illustration": {
      "kind": "sequence",
      "steps": [
        "Enter patient area",
        "Touch bed rail",
        "Finish contact"
      ],
      "highlight": 2,
      "alt": "Enter patient area → Touch bed rail → Finish contact. Highlighted step: Finish contact"
    },
    "provenance": {
      "rights": "original",
      "author": "2Doctor local prototype — original question and diagram"
    },
    "source": {
      "title": "WHO — Key resources on hand hygiene",
      "url": "https://www.who.int/campaigns/world-hand-hygiene-day/key-resources-on-hand-hygiene",
      "verified": "2026-10-06"
    },
    "review": {
      "status": "pending",
      "reviewer": null,
      "date": null,
      "version": "draft-1"
    }
  },
  {
    "n": "demo-hygiene:patient-contact",
    "version": "draft-1",
    "banca": "Original learning demonstration",
    "especialidade": "Infection prevention",
    "tema": "Infection prevention",
    "subtemas": [
      "Hand hygiene"
    ],
    "dificuldade": "Foundational",
    "temImagem": true,
    "enunciado": "In a fictional skills station, a clinician is about to examine a patient by touch. No clean/aseptic task is planned. Which hand-hygiene indication belongs immediately before the examination?",
    "alternativas": {
      "A": "Before touching a patient",
      "B": "After touching a patient",
      "C": "After body-fluid exposure risk",
      "D": "After touching patient surroundings"
    },
    "gabarito": "A",
    "explicacao": "The forthcoming patient contact creates the indication to clean hands before touching the patient. The other listed moments refer to different contacts or to timing after an exposure.",
    "rationales": {
      "A": "Correct: hand hygiene is indicated before the planned patient contact.",
      "B": "This indication follows contact, while the question concerns the preceding action.",
      "C": "This indication follows a body-fluid exposure risk; that is not the event described.",
      "D": "This indication follows contact with the surroundings rather than preceding patient contact."
    },
    "hint": "Look at whether the highlighted action happens before or after patient contact, a procedure, or contact with the surroundings.",
    "illustration": {
      "kind": "sequence",
      "steps": [
        "Approach patient",
        "Begin examination",
        "Complete examination"
      ],
      "highlight": 1,
      "alt": "Approach patient → Begin examination → Complete examination. Highlighted step: Begin examination"
    },
    "provenance": {
      "rights": "original",
      "author": "2Doctor local prototype — original question and diagram"
    },
    "source": {
      "title": "WHO — Key resources on hand hygiene",
      "url": "https://www.who.int/campaigns/world-hand-hygiene-day/key-resources-on-hand-hygiene",
      "verified": "2026-10-06"
    },
    "review": {
      "status": "pending",
      "reviewer": null,
      "date": null,
      "version": "draft-1"
    }
  }
];
