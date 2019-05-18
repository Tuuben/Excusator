import * as admin from 'firebase-admin';
import { combineCollectionSnapshot } from '../firestore';

export interface GeneratedSentanceData {
    text?: string;
    searchQuery?: string;
}

interface Sentance {
    id?: string;
    text?: string; 
    type?: 'intro' | 'subject' | 'action' | 'object' | 'time';
    value?: any;
}

const LIMIT = 200;

async function getIntro() : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'intro')
    .limit(LIMIT);

    const snapshot = await query.get();
    const intros = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!intros || !intros.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (intros.length - 1));
    return intros[randomIndex].text || '';
}

async function getSubject() : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'subject')
    .limit(LIMIT);

    const snapshot = await query.get();
    const subjects = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!subjects || !subjects.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (subjects.length - 1));
    return subjects[randomIndex].text || '';
}

async function getAction() : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'action')
    .limit(LIMIT);

    const snapshot = await query.get();
    const actions = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!actions || !actions.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (actions.length - 1));
    return actions[randomIndex].text || '';
}


async function getObject(): Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'object')
    .limit(LIMIT);

    const snapshot = await query.get();
    const objects = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!objects || !objects.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (objects.length - 1));
    return objects[randomIndex].text || '';
}

async function getTime() : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'time')
    .limit(LIMIT);

    const snapshot = await query.get();
    const times = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!times || !times.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (times.length - 1));
    return times[randomIndex].text || '';
} 

export async function getGeneratedSentance(minutes: number = 5) {
    const [intro, subject, action, object, time] = await Promise.all([
        getIntro(),
        getSubject(),
        getAction(),
        getObject(),
        getTime()
    ]);

    const sentance: string = `${intro} ${subject} ${action} ${object}, ${time} ${minutes || 'some amount of'} minutes!` 

    const data: GeneratedSentanceData = {
        text: sentance,
        searchQuery: object
    };

    return data;
}