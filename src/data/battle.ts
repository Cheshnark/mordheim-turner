import type { ChecklistItem, FaseTurno } from '@/store/tipos'

export type ContenidoFase = {
  numero: 1 | 2 | 3 | 4
  titulo: string
  /** Página de reglas de la fase en mordheimer.net. Solo se muestra en modo tutorial. */
  linkFase: string
  /** Notas siempre visibles, sin checkbox. */
  notasFijas?: string[]
  items: ChecklistItem[]
}

/**
 * Contenido del bucle de Battle, por fase. Mismo modelo de item en tutorial y
 * rápido; en rápido solo se renderiza `texto_corto` (handoff §3).
 * Fuente: docs/handoff.md §5.
 */
export const CONTENIDO_BATTLE: Record<FaseTurno, ContenidoFase> = {
  recuperacion: {
    numero: 1,
    titulo: 'Recuperación',
    linkFase: 'https://mordheimer.net/docs/rules/recovery',
    items: [
      {
        id: 'rec-rout-test',
        texto_corto:
          'Test de Desbandada si el 25 % o más está fuera de combate',
        texto_explicado:
          '¿25 % o más del warband fuera de combate? Test de Desbandada (2D6 ≤ Liderazgo del líder). Si falla, la banda se retira y la partida termina.',
      },
      {
        id: 'rec-estupidez',
        texto_corto: 'Test de Estupidez de los Guerreros Estúpidos',
        texto_explicado:
          'Cada miniatura estúpida: 2D6 ≤ su Liderazgo. Si falla, no lucha cuerpo a cuerpo ni lanza hechizos hasta la próxima Recuperación.',
      },
      {
        id: 'rec-levantar-derribados',
        texto_corto: 'Los derribados se levantan',
        texto_explicado:
          'Ese turno mueven a mitad de velocidad, pueden disparar y lanzar hechizos, pero no cargar ni correr.',
      },
      {
        id: 'rec-aturdidos-a-derribados',
        texto_corto: 'Los aturdidos pasan a derribados',
        texto_explicado:
          'Ya derribados, pueden arrastrarse 2" (si están trabados en combate, solo si su rival lucha con otro), pero no luchan, disparan ni lanzan hechizos.',
      },
      {
        id: 'rec-rally',
        texto_corto: 'Test de Rally de los guerreros en fuga',
        texto_explicado:
          '2D6 ≤ Liderazgo. No se puede intentar si el enemigo más cercano está más cerca que cualquier aliado. Si se recupera, no puede mover ni disparar ese turno, pero sí lanzar hechizos.',
      },
    ],
  },

  movimiento: {
    numero: 2,
    titulo: 'Movimiento',
    linkFase: 'https://mordheimer.net/docs/rules/movement',
    items: [
      {
        id: 'mov-declarar-cargas',
        texto_corto: 'Declarar todas las cargas antes de mover a nadie',
        texto_explicado:
          'Se declara sin medir distancia, indicando el objetivo. Es como correr (doble de Movimiento) hasta quedar peana con peana; quien carga golpea primero ese combate.',
      },
      {
        id: 'mov-movimientos-obligatorios',
        texto_corto: 'Resolver movimientos obligatorios',
        texto_explicado: 'Huida, etc.',
      },
      {
        id: 'mov-mover-resto',
        texto_corto: 'Mover el resto de guerreros, uno a uno',
      },
      {
        id: 'mov-no-correr',
        texto_corto: 'Sin correr si hay enemigos a 8" al empezar el turno',
      },
      {
        id: 'mov-declarar-ocultos',
        texto_corto: 'Declarar qué guerreros quedan ocultos',
      },
      {
        id: 'mov-casos-especiales',
        texto_corto: 'Casos especiales si aplica',
        texto_explicado: 'Saltos, escalada, caídas.',
      },
    ],
  },

  disparo: {
    numero: 3,
    titulo: 'Disparo',
    linkFase: 'https://mordheimer.net/docs/rules/shooting',
    items: [
      {
        id: 'dis-trabados-no-disparan',
        texto_corto:
          'Los modelos trabados en combate cuerpo a cuerpo no disparan',
      },
      {
        id: 'dis-resolver',
        texto_corto: 'Resolver disparos de los guerreros que puedan hacerlo',
      },
    ],
  },

  combate: {
    numero: 4,
    titulo: 'Combate cuerpo a cuerpo',
    linkFase: 'https://mordheimer.net/docs/rules/close-combat',
    notasFijas: [
      'Esta fase se resuelve sí o sí en cada ronda si hay modelos trabados, sin importar de quién es el turno. No es un paso que se pueda saltar por no ser "tu turno".',
    ],
    items: [
      {
        id: 'com-strike-first',
        texto_corto: 'Quien carga o tiene "Strike First" golpea primero',
        texto_explicado:
          'Si varios tienen "Strike First" entre sí, se ordenan por Iniciativa, igual que el resto.',
      },
      {
        id: 'com-orden-golpes',
        texto_corto: 'Golpes en orden de Iniciativa, de mayor a menor',
        texto_explicado: 'Empates: se decide con un dado.',
      },
      {
        id: 'com-excepcion-levantado',
        texto_corto:
          'Quien se levantó en la Recuperación de este turno golpea el último',
      },
      {
        id: 'com-derribado-golpeado-auto',
        texto_corto:
          'Un modelo derribado en combate es golpeado automáticamente',
      },
      {
        id: 'com-solo-contra-varios',
        texto_corto:
          'Test de Liderazgo si un guerrero lucha solo contra 2 o más sin aliados a 6"',
        texto_explicado:
          'Se comprueba al final de la fase: test de Liderazgo o huye.',
      },
    ],
  },
}
