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
  memberHub: {
    brandSubtitle: "Tellus Cooperative Blockchain Hub Santiago",
    nav: {
      menu: "Menú",
      backToMenu: "← Menú",
      rooms: "Salas",
      events: "Eventos",
      tour: "Tour",
      connect: "Conectar",
    },
    connect: {
      pageTitle: "Conectar mensajería",
      pageDescription:
        "Vincula tu cuenta de Telegram o WhatsApp para reservar check-ins del hub por chat con el bot de UNBLCK.",
      heading: "Conectar mensajería",
      description:
        "Vincula Telegram o WhatsApp para reservar check-ins del hub por chat.",
      yourLinkCode: "Tu código de enlace",
      sendCodeHint:
        "Envía este código al bot de UNBLCK en Telegram o WhatsApp.",
      expiresIn: "Expira en:",
      generateCode: "Generar código",
      generating: "Generando...",
      generateFailed: "No se pudo generar el código. Inténtalo de nuevo.",
      connectedChannels: "Canales conectados",
      linkedOn: "Vinculado el {date}",
      disconnect: "Desconectar",
      disconnectConfirm: "¿Seguro que quieres desconectar este canal?",
    },
    tourComingSoon: {
      title: "Próximamente",
      description: "Actualmente en desarrollo.",
    },
    profile: {
      stellarPassport: "Stellar Passport",
      logout: "Cerrar sesión",
      loggingOut: "Cerrando sesión...",
      notVerified: "Sin verificar",
      language: "Idioma",
    },
    home: {
      hubAccess: "Acceso al Hub",
    },
    coffee: {
      title: "☕ Café disponible hoy",
      description: "Tienes acceso al hub hoy. Canjea tu token de café en el hub.",
      redeem: "Canjear café",
      modal: {
        title: "Tu café diario",
        faucetTitle: "Faucet de token de café",
        faucetBody:
          "En la oficina hay un faucet de token de café. Acerca tu teléfono para reclamar tu dosis diaria de cafeína — de la casa, gratis.",
        latrianaTitle: "Paga en LATRIANA",
        latrianaBody:
          "Abajo, la cafetería LATRIANA acepta pagos con Sozu. Reclama tu café pagando con el token de café allí.",
        goToWallet: "Ir a Sozu Wallet",
        close: "Cerrar",
      },
    },
    bookings: {
      title: "Reservas del Hub",
      unlimited: "Ilimitado",
      credits: "{remaining}/{total} créditos · lun–vie",
      builderHint: "Lun–vie · agenda tu semana cada domingo.",
      founderHint: "Acceso al hub lun–vie.",
      loading: "Cargando reservas...",
      loadFailed: "No se pudieron cargar las reservas",
      selected: "Seleccionado",
      booked: "Reservado",
      requestPassFor: "Pedir pase para",
      confirming: "Confirmando...",
      confirmPass: "Confirmar y pedir pase",
    },
    rooms: {
      pageTitle: "Reservar sala | Tellus Hub",
      pageDescription:
        "Reserva un espacio de trabajo en Tellus Blockchain Hub STGO",
      pageHeading: "Reservar sala",
      pageIntro:
        "Reserva salas de reuniones, cabinas telefónicas y nuestro estudio de podcast.",
      loading: "Cargando salas...",
      loadFailed: "No se pudieron cargar las salas",
      bookingForToday: "Reserva para hoy",
      tier: "Nivel",
      builderTierHint: "30 o 60 min, una vez al día",
      founderTierHint: "Reserva cuando quieras, sin hot desk requerido",
      noHotDeskTitle: "No tienes hot desk agendado para hoy",
      noHotDeskBody:
        "Los Builders necesitan un día de acceso al hub antes de reservar una sala. Agenda un día en el calendario del hub primero.",
      myBookingsToday: "Mis reservas de hoy",
      roomsHeading: "Salas",
      capacity: "Capacidad: {count}",
      slotsBookedToday: "{count} turnos reservados hoy",
      adminApprovalBadge: "Aprobación admin",
      cancelBooking: "Cancelar",
      cancelConfirm: "¿Cancelar esta reserva?",
      bookingCancelled: "Reserva cancelada",
      cancelFailed: "No se pudo cancelar la reserva",
      bookingFailed: "Error al reservar",
      roomFallback: "Sala",
      pendingAdmin: "Pendiente admin",
      duration: "Duración",
      durationMinutes: "{mins} min",
      selectTimeSlot: "Selecciona un horario",
      eventSpaceNotice:
        "La Terraza requiere confirmación del admin y puede incluir un cargo adicional.",
      slotPending: "Pendiente",
      slotBooked: "Reservado",
      slotUnavailable: "N/D",
      legendAvailable: "Disponible",
      legendBooked: "Reservado",
      legendPending: "Pendiente",
      roomTypes: {
        small_meeting: "Sala Pequeña",
        large_meeting: "Sala Grande",
        phone_booth: "Cabina Telefónica",
        podcast_studio: "Estudio Podcast",
        event_space: "Terraza",
      },
      memberTiers: {
        Builder: "Builder",
        Founder: "Founder",
      },
      eventSpace: {
        openAccessNote: "Acceso libre durante horario del hub",
        daytimeNote:
          "Durante el horario del hub, los miembros con check-in pueden usar este espacio libremente — sin reserva.",
        afterHoursTitle: "Solicitar evento fuera de horario",
        eventDescription: "Descripción del evento",
        eventDescriptionPlaceholder: "¿De qué trata el evento?",
        projectName: "Proyecto u organización",
        projectNamePlaceholder: "Nombre de tu proyecto",
        requestedDate: "Fecha solicitada",
        requestedTime: "Hora solicitada",
        submitRequest: "Solicitar programación de evento",
        submitting: "Enviando...",
        requestFailed: "No se pudo enviar la solicitud de programación",
      },
    },
    memberStatus: {
      noApplication: {
        title: "No encontramos tu postulación",
        description:
          "No encontramos una postulación asociada a tu cuenta.",
        hubAccess: "Pedir acceso al Hub",
        accelerator: "Postular a la Aceleradora",
      },
      pending: {
        title: "Postulación en revisión",
        description:
          "¡Gracias por postular a UNBLCK Hub! Estamos revisando tu postulación.",
        appliedOn: "Postulaste el {date}",
        backHome: "Volver al inicio",
      },
      rejected: {
        title: "Postulación no aprobada",
        description:
          "Por ahora no podemos ofrecerte un cupo en UNBLCK Hub. Te animamos a seguir construyendo y conectarte con la comunidad.",
        backHome: "Volver al inicio",
        community:
          "Únete a los eventos StellarBarrio para conectar con la comunidad",
      },
    },
  },
  form: {
    back: "Atrás",
    continue: "Continuar",
    submit: "Enviar",
    submitting: "Enviando...",
    enterHint: "Enter ↵",
    stepProgress: "{current} de {total}",
    validationRequired: "Completa esta pregunta para continuar.",
    invalidEmail: "Ingresa un email válido",
    submissionFailed: "Algo salió mal",
    backToHome: "Volver al inicio",
    resendEmail: "Reenviar email",
    resending: "Enviando...",
    emailSent: "¡Email enviado! Revisa tu bandeja de entrada.",
  },
  login: {
    pageTitle: "Iniciar sesión | UNBLCK",
    pageDescription: "Accede a tu cuenta del UNBLCK Hub",
    welcome: "Bienvenido de nuevo",
    subtitle:
      "Los miembros usan magic link. Los admins inician sesión con contraseña.",
    emailLabel: "Email",
    emailPlaceholder: "tu@empresa.com",
    passwordLabel: "Contraseña",
    passwordRequired: "Ingresa tu contraseña para continuar.",
    sendMagicLink: "Enviar magic link",
    loginWithPassword: "Iniciar sesión con contraseña",
    loginWithPasswordInstead: "Iniciar sesión con contraseña",
    processing: "Procesando...",
    checkEmailTitle: "Revisa tu email",
    checkEmailBody:
      "Te enviamos un magic link a {email}. Haz clic para iniciar sesión.",
    tryDifferentEmail: "Probar con otro email",
    noAccount: "¿No tienes cuenta?",
    applyHere: "Postula aquí",
    errorGeneric: "Algo salió mal",
    magicLinkFailed: "No se pudo enviar el magic link",
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
      ambassador: {
        question: "¿Eres Stellar Ambassador?",
        hint: "El acceso al hub es para Stellar Ambassadors. ¿Aún no lo eres? Únete a la cooperativa en Tellus.",
        choices: {
          yes: "Sí, soy Stellar Ambassador",
          no: "No, aún no",
        },
        gateMessage:
          "Necesitas ser Stellar Ambassador para pedir acceso al hub. Únete a la cooperativa Tellus para serlo — en telluscoop.org, toca “Join the cooperative” en la página principal.",
        gateLinkText: "Ser Stellar Ambassador",
      },
      passport: {
        question: "¿Cuál es tu usuario de Stellar Passport?",
        hint: "Lo usamos para verificar tu identidad. ¿Aún no tienes uno?",
        placeholder: "@tunombre o tu usuario de GitHub",
        linkText: "Crear Passport",
      },
      terms: {
        question: "Términos y Condiciones",
        hint: "Acepto los términos y condiciones",
        linkText: "Términos y Condiciones",
        fullTermsLink: "Lee los términos completos",
        highlights: [
          {
            icon: "📸",
            text: "Aceptas el uso de tu imagen mientras trabajas en el hub",
          },
          {
            icon: "🤐",
            text: "Aceptas la confidencialidad de información compartida por el equipo del hub o acelerador",
          },
          {
            icon: "🔒",
            text: "Aceptas seguir los procedimientos de seguridad establecidos",
          },
          {
            icon: "🎒",
            text: "Aceptas responsabilidad por tus pertenencias personales",
          },
          {
            icon: "🔐",
            text: "Aceptas el uso de tu información para propósitos de KYC (siempre privada)",
          },
        ],
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
  acceleratorApply: {
    pageTitle: "Postular | UNBLCK Accelerator",
    pageDescription:
      "Postula a UNBLCK — la aceleradora de Santiago para founders de AI y blockchain.",
    intro: {
      question: "Postula a UNBLCK Accelerator",
      hint: "Postulación completa para nuestro programa de aceleración. Toma unos 5 minutos.",
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
        question: "¿Cómo se llama tu proyecto o empresa?",
        placeholder: "Acme Labs",
      },
      projectLink: {
        question: "Link del proyecto (web, deck o demo)",
        placeholder: "https://",
      },
      buildDescription: {
        question: "¿Qué estás construyendo?",
        placeholder:
          "Cuéntanos sobre tu producto — blockchain, AI o ambos. ¿Para quién es? ¿Qué problema resuelve?",
      },
      location: {
        question: "¿Dónde estás ubicado?",
        choices: {
          santiago: "Santiago",
          relocating: "Me estoy mudando a Santiago",
          remote: "Remoto — fuera de Chile",
        },
      },
      stage: {
        question: "¿En qué etapa está tu proyecto?",
        choices: {
          idea: "Idea",
          prototype: "Prototipo/MVP",
          live: "Producto en vivo",
          scaling: "Creciendo/Escalando",
        },
      },
      teamSize: {
        question: "¿Qué tan grande es tu equipo?",
        choices: {
          solo: "Founder solo",
          small: "2-3 personas",
          medium: "4-6 personas",
          large: "7+ personas",
        },
      },
      fundingStatus: {
        question: "¿Cuál es tu estado de financiamiento?",
        choices: {
          preSeed: "Pre-seed / Bootstrapped",
          grants: "Recibió grants",
          angel: "Angel funding",
          seed: "Seed funded",
          seriesA: "Series A+",
        },
      },
      motivation: {
        question: "¿Por qué UNBLCK?",
        placeholder:
          "¿Qué te ayudaría unirte a la aceleradora a lograr? ¿Cuáles son tus metas para los próximos 90 días?",
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
        "Te enviamos un enlace seguro de inicio de sesión. Haz clic para activar tu cuenta y revisar el estado de tu postulación.",
      extra:
        "Ven a StellarBarrio en Tellus Blockchain Hub STGO — nuestro evento mensual de builders y la puerta de entrada a Insta Awards.",
    },
  },
  notFound: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o fue movida.",
    backHome: "Volver al inicio",
    hubApply: "Solicitar acceso al Hub",
    acceleratorApply: "Postular al Acelerador",
  },
  newsletterPopup: {
    message: "Suscríbete a nuestro newsletter y mantente al día",
    emailPlaceholder: "tu@empresa.com",
    subscribe: "Suscribirme",
    subscribing: "Suscribiendo...",
    dismiss: "Cerrar",
    success: "¡Suscripción confirmada!",
    error: "No se pudo suscribir. Intenta de nuevo.",
    invalidEmail: "Ingresa un email válido",
  },
  adminRooms: {
    pageTitle: "Gestión de salas | Admin",
    pageDescription: "Administrar salas del hub",
    pageHeading: "Gestión de salas",
    pageIntro: "Administra las salas del hub y su disponibilidad",
    backToAdmin: "Volver al Admin",
    addRoom: "Agregar sala",
    newRoom: "Nueva sala",
    editRoom: "Editar sala",
    name: "Nombre",
    type: "Tipo",
    capacity: "Capacidad",
    amenities: "Amenidades (separadas por coma)",
    imageUrl: "URL de imagen",
    imageUrlPlaceholder: "https://ejemplo.com/sala.jpg",
    bookingEnabled: "Reservas habilitadas",
    save: "Guardar",
    cancel: "Cancelar",
    deleteConfirm: "¿Eliminar esta sala?",
    enabled: "Habilitada",
    disabled: "Deshabilitada",
    typeCapacity: "Tipo: {type} · Capacidad: {capacity}",
    imageLabel: "Imagen: {url}",
    roomTypes: {
      small_meeting: "Sala Pequeña",
      large_meeting: "Sala Grande",
      phone_booth: "Cabina Telefónica",
      podcast_studio: "Estudio Podcast",
      event_space: "Terraza",
    },
  },
};
