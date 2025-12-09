import { Brain, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

export type QuizType = 'question' | 'info' | 'loader' | 'loading';

export type Option = {
    id: string;
    label: string;
    value: string;
    icon?: string;
    imagePrompt?: string;
    imageUrl?: string;
};

// Base interface
interface BaseStep {
    id: string;
    type: QuizType;
    progressBarText: string;
}

// 1. Question Step (Standard)
export interface QuestionStep extends BaseStep {
    type: 'question';
    question: string;
    options: Option[];
}

// 2. Info Step (Editorial/Bridge)
export interface InfoStep extends BaseStep {
    type: 'info';
    title: string;
    description: string;
    buttonText: string;
    icon?: any; // Lucide Icon component
}

// 3. Loader Step (Transition)
export interface LoaderStep extends BaseStep {
    type: 'loader';
    duration: number; // ms
    text: string;
}

// 4. Checklist Loading Step (Final Diagnosis)
export interface ChecklistStep extends BaseStep {
    type: 'loading';
    question?: string; // Optional legacy compatibility
    loadingText: string[];
}

export type QuizStep = QuestionStep | InfoStep | LoaderStep | ChecklistStep;

export const QUIZ_DATA: QuizStep[] = [
    // Phase 1: Engagement
    {
        id: 'muscle_flaccidity',
        type: 'question',
        question: '¿Notas que, aunque comas bien, tus músculos parecen volverse más <br/><span class="font-bold text-primary">"blandos" o flácidos</span><br/> con el paso de los años?',
        progressBarText: 'Analizando perfil muscular...',
        options: [
            {
                id: 'yes_flaccid',
                label: 'Sí, <b>siento exactamente eso.</b>',
                value: 'yes',
            },
            {
                id: 'no_firm',
                label: 'No, mis músculos se sienten <b>firmes.</b>',
                value: 'no',
            },
        ],
    },
    {
        id: 'gender',
        type: 'question',
        question: '¿Cuál es tu <b>género biológico</b>?',
        progressBarText: 'Configurando parámetros biológicos...',
        options: [
            {
                id: 'male',
                label: 'Hombre',
                value: 'male',
                imageUrl: 'https://i.postimg.cc/pXBWyB7H/Untitled_(4).webp'
            },
            {
                id: 'female',
                label: 'Mujer',
                value: 'female',
                imageUrl: 'https://i.postimg.cc/28xk3xJ8/Untitled-(5).webp'
            },
        ],
    },
    {
        id: 'age',
        type: 'question',
        question: '¿En qué <b>rango de edad</b> te encuentras hoy?',
        progressBarText: 'Ajustando rango etario...',
        options: [
            { id: '40-50', label: 'Entre 40 y 50 años', value: '40-50' },
            { id: '51-65', label: 'Entre <b>51 y 65 años</b>', value: '51-65' },
            { id: '65+', label: 'Más de <b>65 años</b>', value: '65+' },
        ],
    },

    // --- BRIDGE 1: Contextualização ---
    {
        id: 'bridge_loader_1',
        type: 'loader',
        progressBarText: 'Procesando datos demográficos...',
        text: 'Comparando con base de datos...',
        duration: 2000
    },
    {
        id: 'bridge_info_1',
        type: 'info',
        progressBarText: 'Dato Científico Relevante',
        title: '¿Sabías que...',
        description: 'A partir de los 40 años, perdemos naturalmente cerca del <b>1% de masa muscular por año</b>? Esto se llama Sarcopenia y es la causa #1 de fragilidad.',
        buttonText: 'Entiendo, continuar',
        icon: Brain
    },

    // Phase 2: Pain Agitation
    {
        id: 'energy',
        type: 'question',
        question: 'Si comparas tu energía de hoy con la de hace 10 años,<br/> <b>¿cómo describirías tu disposición diaria?</b>',
        progressBarText: 'Evaluando niveles de vitalidad...',
        options: [
            {
                id: 'tired_constant',
                label: 'Siento un <b>cansancio constante</b>, como si mi batería nunca cargara al 100%.',
                value: 'tired_constant',
            },
            {
                id: 'tired_effort',
                label: 'Tengo energía, pero <b>me agoto muy rápido</b> después de cualquier esfuerzo físico.',
                value: 'tired_effort',
            },
            {
                id: 'energy_same',
                label: 'Mi energía <b>sigue igual</b> que siempre.',
                value: 'same',
            },
        ],
    },
    {
        id: 'recovery',
        type: 'question',
        question: 'Cuando sufres una pequeña lesión o dolor muscular,<br/> <b>¿cómo es tu velocidad de recuperación?</b>',
        progressBarText: 'Verificando capacidad de regeneración...',
        options: [
            { id: 'slow', label: 'Tarda mucho más que antes; <span class="text-red-600 font-bold">cualquier dolorcito dura semanas.</span>', value: 'slow' },
            { id: 'joint_pain', label: 'Me recupero bien, pero siento <b>dolor en las articulaciones</b> con frecuencia.', value: 'joint_pain' },
            { id: 'fast', label: 'Mi cuerpo se regenera rápido, como cuando era joven.', value: 'fast' },
        ],
    },
    {
        id: 'digestion',
        type: 'question',
        question: 'Después de una comida rica en proteínas,<br/> <b>¿cómo reacciona tu estómago?</b>',
        progressBarText: 'Analizando eficiencia metabólica...',
        options: [
            {
                id: 'heavy',
                label: 'Siento <span class="text-red-600 font-bold">pesadez, inflamación o gases.</span> Parece que la comida se queda estancada.',
                value: 'heavy',
            },
            { id: 'acidity', label: 'Tengo <b>acidez o reflujo</b> ocasionalmente.', value: 'acidity' },
            {
                id: 'perfect',
                label: 'Hago la digestión <b>perfectamente</b>, sin ninguna molestia.',
                value: 'perfect',
            },
        ],
    },

    // --- BRIDGE 2: Validação de Sintoma ---
    {
        id: 'bridge_loader_2',
        type: 'loader',
        progressBarText: 'Correlacionando síntomas...',
        text: 'Analizando absorción de nutrientes...',
        duration: 2500
    },
    {
        id: 'bridge_info_2',
        type: 'info',
        progressBarText: 'Alerta Metabólica',
        title: 'Atención a este síntoma',
        description: 'La mala digestión de proteínas es una <b>señal silenciosa</b> de que tu cuerpo ha dejado de producir las enzimas críticas para construir músculo.',
        buttonText: 'Quiero solucionar esto',
        icon: AlertTriangle
    },

    {
        id: 'skin_hair',
        type: 'question',
        question: 'Además de la parte muscular,<br/> ¿has notado algún cambio reciente en la <b>calidad de tu piel y cabello?</b>',
        progressBarText: 'Escaneando signos de envejecimiento...',
        options: [
            { id: 'thin', label: 'Sí, mi piel está más <b>fina/flácida</b> y el cabello quebradizo.', value: 'thin' },
            { id: 'wrinkles', label: 'Noté apenas algunas arrugas más, nada preocupante.', value: 'wrinkles' },
            { id: 'excellent', label: 'No, mi piel y cabello están excelentes.', value: 'excellent' },
        ],
    },
    {
        id: 'fear_dependence',
        type: 'question',
        question: 'Siendo 100% honesto:<br/> <b>¿cuál es tu mayor miedo con respecto al envejecimiento físico?</b>',
        progressBarText: 'Evaluando factores emocionales...',
        options: [
            {
                id: 'dependence',
                label: 'Tengo miedo de <span class="text-red-600 font-bold">perder mi independencia</span> y depender de otros.',
                value: 'dependence',
            },
            {
                id: 'fracture',
                label: 'Tengo miedo de caerme y sufrir una <b>fractura difícil de curar.</b>',
                value: 'fracture',
            },
            { id: 'vanity', label: 'Tengo miedo de perder mi vanidad y que no me guste lo que veo en el espejo.', value: 'vanity' },
            { id: 'dont_think', label: 'No pienso mucho en eso.', value: 'none' },
        ],
    },
    {
        id: 'exercise_frustration',
        type: 'question',
        question: '¿Practicas o has intentado practicar ejercicio físico recientemente para <b>ganar masa muscular?</b>',
        progressBarText: 'Revisando historial de actividad...',
        options: [
            { id: 'no_gain', label: 'Sí, pero <b>parece que no gano músculo</b>, no importa cuánto entrene.', value: 'no_gain' },
            { id: 'feel_weak', label: 'Intento caminar o hacer algo suave, pero <b>me siento débil.</b>', value: 'feel_weak' },
            { id: 'no_exercise', label: 'No hago ejercicio actualmente.', value: 'none' },
        ],
    },
    {
        id: 'bone_health',
        type: 'question',
        question: '¿Tus exámenes o sensaciones indican alguna preocupación con la <b>densidad de tus huesos?</b>',
        progressBarText: 'Verificando salud ósea...',
        options: [
            { id: 'fragile', label: 'Sí, siento que mis huesos están más <span class="text-red-600 font-bold">frágiles</span> y evito los impactos.', value: 'fragile' },
            { id: 'pain', label: 'Tengo <b>dolores constantes</b> en la espalda o rodillas.', value: 'pain' },
            { id: 'strong', label: 'Mis huesos parecen fuertes hasta ahora.', value: 'strong' },
        ],
    },
    // Phase 3: Awareness & Solution
    {
        id: 'supplements',
        type: 'question',
        question: '¿Ya intentaste tomar <b>Batidos de Proteína, Whey o Colágeno</b> para intentar resolver estos problemas?',
        progressBarText: 'Analizando absorción de nutrientes...',
        options: [
            { id: 'inflamed', label: 'Sí, ya tomé, pero <b>me inflamaban</b> y no vi mucha diferencia.', value: 'inflamed' },
            { id: 'slow_results', label: 'Los tomo actualmente, pero los resultados son <b>muy lentos.</b>', value: 'slow_results' },
            { id: 'never', label: 'Nunca tomé porque el sabor es desagradable o tengo miedo de engordar.', value: 'never' },
        ],
    },
    {
        id: 'metabolic_waste',
        type: 'question',
        question: '¿Sabías que la mayor parte de la proteína que comemos <span class="text-red-600 font-bold">se convierte en AZÚCAR y grasa</span> si no tenemos las enzimas correctas?',
        progressBarText: 'Detectando ineficiencias metabólicas...',
        options: [
            { id: 'no_idea', label: 'No tenía idea, pensé que la proteína se volvía músculo automáticamente.', value: 'no_idea' },
            { id: 'heard', label: 'Ya había escuchado algo, pero no sé cómo evitarlo.', value: 'heard' },
            { id: 'explains', label: 'Eso explicaría por qué me cuesta tanto perder peso.', value: 'explains' },
        ],
    },
    {
        id: 'magic_solution',
        type: 'question',
        question: 'Imagina si existiera una forma de saltarse la digestión y entregar los nutrientes <br/><b>directamente en tu sangre...</b><br/> ¿Cómo cambiaría esto tu rutina?',
        progressBarText: 'Calculando potencial de mejora...',
        options: [
            {
                id: 'dream',
                label: 'Sería un sueño: <b>ganar fuerza</b> sin tener que comer kilos de carne.',
                value: 'dream',
            },
            {
                id: 'peace',
                label: 'Me daría <b>paz mental</b> saber que estoy nutriendo mi cuerpo de verdad.',
                value: 'peace',
            },
            { id: 'energy_back', label: 'Me encantaría tener la <b>energía y el cuerpo</b> que tenía hace 20 años.', value: 'energy_back' },
        ],
    },
    {
        id: 'close_urgency',
        type: 'question',
        question: 'Nuestros algoritmos identificaron que tu perfil es compatible con el <b>"Protocolo de Nitrógeno Optimizado"</b>.<br/><br/> ¿Te gustaría ver un breve documental sobre esto?',
        progressBarText: 'Finalizando perfil...',
        options: [
            { id: 'yes_discovery', label: '¡Sí! <b>Quiero saber cuál es ese descubrimiento ahora.</b>', value: 'yes' },
            { id: 'yes_recover', label: 'Quiero entender cómo recuperar mi fuerza e independencia.', value: 'yes' },
        ],
    },
    {
        id: 'loading_diagnosis',
        type: 'loading',
        progressBarText: 'Generando diagnóstico...',
        loadingText: [
            'Analizando tus respuestas...',
            'Verificando perfil de absorción proteica...',
            'Identificamos 3 errores en tu dieta actual...',
        ]
    }
];
