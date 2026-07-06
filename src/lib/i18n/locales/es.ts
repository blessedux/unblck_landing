import type { Translations } from "./en";
import { CENTRO_LENERIA_URL, TELLUS_HUB_MAPS_URL } from "./en";

/** Chilean Spanish — tono directo, vocabulario local del ecosistema startup */
export const es: Translations = {
  nav: {
    accelerator: "Aceleradora",
    hub: "Hub",
    ourStory: "Nuestra historia",
    apply: "Postular",
  },
  hero: {
    subtitle: "Buscando mentes inquietas construyendo el futuro.",
    cta: "Postular a la aceleradora",
  },
  whatWeDo: {
    label: "Qué hacemos",
    heading: "Todo lo que necesitas para pasar de builder a startup.",
    intro:
      "UNBLCK es un programa de aceleración dentro del Tellus Blockchain Hub STGO para lanzar y escalar en Web3 integrando tecnologías emergentes, AI y blockchain, sin hacerlo en solitario.",
    introLink: {
      before: "UNBLCK es un programa de aceleración dentro del ",
      label: "Tellus Blockchain Hub STGO",
      after:
        " para lanzar y escalar en Web3 integrando tecnologías emergentes, AI y blockchain, sin hacerlo en solitario.",
      href: TELLUS_HUB_MAPS_URL,
    },
    login: "Iniciar sesión",
    cta: "Pedir acceso al Tellus Hub",
    offerings: [
      {
        title: "Espacio de trabajo",
        description:
          "Un hub físico en Centro Leneria, una casa de 1935 en el corazón de la ciudad de Santiago para enfocarte, colaborar y construir junto a otros builders.",
        hubLink: {
          before: "Un hub físico en ",
          label: "Centro Leneria",
          after:
            ", una casa de 1935 en el corazón de la ciudad de Santiago para enfocarte, colaborar y construir junto a otros builders.",
          href: CENTRO_LENERIA_URL,
        },
      },
      {
        title: "Mentoría",
        description:
          "Acceso directo a builders con experiencia en AI y blockchain, programas de aceleración y capital para levantar tu startup.",
      },
      {
        title: "Programa de fondos concursables y becas de innovación",
        description:
          "Un camino completo para levantar capital y crecer, desde micro grants hasta go-to-market y demo days.", 
      },
      {
        title: "Club privado de founders",
        description:
          "No es un cowork abierto. Una comunidad curada de founders que quieren un templo de trabajo para escalar su startup.",
      },
    ],
  },
  instaAwards: {
    label: "Fondos y camino del founder",
    heading: "De la idea al demo day.",
    intro:
      "UNBLCK acompaña a los founders en todo el camino: desde la idea y el producto, pasando por el capital inicial, la estrategia go-to-market, hasta las presentaciones en demo day para levantar rondas de crecimiento.",
    journey: [
      {
        phase: "Build",
        title: "Consigue capital grant",
        description:
          "Empieza con fondos equity-free para validar tu idea y sacar la primera versión. Sin equity, solo capital para acelerar.",
      },
      {
        phase: "Launch",
        title: "Lanzate al mercado",
        description:
          "Trabaja con nuestro equipo en posicionamiento, estrategia go-to-market y preparación para tus primeros usuarios y clientes.",
      },
      {
        phase: "Scale",
        title: "Demo day y siguientes rondas",
        description:
          "Presenta ante inversionistas en nuestros demo days. Conexiones con VCs, ángeles y capital de follow-on para escalar tu startup.",
      },
    ],
    fundLabel: "Fondo actual · Stellar SCF",
    fundTitle: "Stellar Insta Awards",
    grantAmount: "$5.000",
    grantType: "grant sin dilución",
    fundDescription:
      "Sin equity ni participación accionaria, capital y aceleración para llevar tu startup construida sobre la red de Stellar de prototipo al mercado.",
    tags: [
      { id: "non-dilutive", label: "Sin dilución" },
      { id: "demo-day-pipeline", label: "Camino a demo day" },
      { id: "stellarbarrio-exclusive", label: "Exclusivo StellarBarrio" },
    ],
    howToApply: "Cómo postular",
    steps: [
      {
        title: "Asiste a StellarBarrio",
        description:
          "Ven a un evento de StellarBarrio en el Tellus Blockchain Hub STGO. Recibirás un código de referido exclusivo para postular.",
      },
      {
        title: "Envía tu postulación",
        description:
          "Usa tu código de referido para postular. Explica tu build en Stellar, el use case on-chain y qué desbloquea el grant.",
      },
      {
        title: "Entra al pipeline",
        description:
          "Los equipos seleccionados reciben el grant de hasta $5.000 USD, apoyo de aceleración, demodays y un camino a mainnet.",
      },
    ],
    applyCta: "Postular al fondo",
    lumaAriaLabel: "Ver eventos de Tellus Cooperative en Luma",
  },
  footer: {
    copyright: "Aceleradora de AI y blockchain",
  },
  form: {
    back: "Atrás",
    continue: "Continuar",
    submit: "Enviar",
    submitting: "Enviando...",
    enterHint: "Enter ↵",
    stepProgress: "{current} de {total}",
    validationRequired: "Completa esta pregunta para continuar.",
    submissionFailed: "Algo salió mal",
    backToHome: "Volver al inicio",
    resendEmail: "Reenviar email",
    resending: "Enviando...",
    emailSent: "¡Email enviado! Revisa tu bandeja de entrada.",
  },
  hubApply: {
    pageTitle: "Pedir acceso | Tellus Hub",
    pageDescription:
      "Pide acceso al Tellus Blockchain Hub en Santiago de Chile.",
    intro: {
      question: "Pide acceso al Tellus Hub en Santiago de Chile",
      hint: "Postulación rápida para acceso al workspace. Toma 2 minutos.",
    },
    fields: {
      fullName: {
        question: "¿Cómo te llamas?",
        placeholder: "Jane Doe",
      },
      email: {
        question: "¿Cuál es tu email?",
        placeholder: "tu@empresa.com",
      },
      projectName: {
        question: "¿En qué estás trabajando?",
        placeholder: "Breve descripción de tu proyecto",
      },
      location: {
        question: "¿Dónde estás ubicado?",
        choices: {
          santiago: "Santiago",
          relocating: "Me estoy mudando a Santiago",
          remote: "Remoto — fuera de Chile",
        },
      },
      passport: {
        question: "¿Cuál es tu usuario de Stellar Passport?",
        hint: "Lo usamos para verificar tu identidad. ¿Aún no tienes uno?",
        placeholder: "@tunombre o tu usuario de GitHub",
        linkText: "Crear Passport",
      },
      terms: {
        question: "Términos y Condiciones",
        hint: "Acepto los",
        linkText: "Términos y Condiciones",
      },
    },
    success: {
      label: "Postulación recibida",
      title: "Revisa tu email para el magic link",
      description:
        "Te enviamos un enlace seguro de inicio de sesión. Haz clic para activar tu cuenta y acceder al hub.",
      extra:
        "Ven a StellarBarrio en Tellus Blockchain Hub STGO — nuestro evento mensual de builders.",
    },
  },
};
