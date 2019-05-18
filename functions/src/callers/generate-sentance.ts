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

async function getIntro(isFormal: boolean) : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'intro')
    .where('value', '==', isFormal ? '1' : '0')
    .limit(LIMIT);

    const snapshot = await query.get();
    const intros = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!intros || !intros.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (intros.length - 1));
    return intros[randomIndex].text || '';
}

async function getSubject(isFormal: boolean) : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'subject')
    .where('value', '==', isFormal ? '1' : '0')
    .limit(LIMIT);

    const snapshot = await query.get();
    const subjects = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!subjects || !subjects.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (subjects.length - 1));
    return subjects[randomIndex].text || '';
}

async function getAction(isFormal: boolean) : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'action')
    .where('value', '==', isFormal ? '1' : '0')
    .limit(LIMIT);

    const snapshot = await query.get();
    const actions = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!actions || !actions.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (actions.length - 1));
    return actions[randomIndex].text || '';
}


async function getObject(isFormal: boolean): Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'object')
    .where('value', '==', isFormal ? '1' : '0')
    .limit(LIMIT);

    const snapshot = await query.get();
    const objects = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!objects || !objects.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (objects.length - 1));
    return objects[randomIndex].text || '';
}

async function getTime(isFormal: boolean) : Promise<string> {
    const query = await admin
    .firestore()
    .collection('sentances')
    .where('type', '==', 'time')
    .where('value', '==', isFormal ? '1' : '0')
    .limit(LIMIT);

    const snapshot = await query.get();
    const times = combineCollectionSnapshot(snapshot) as Sentance[];

    if(!times || !times.length){
        return '';
    }

    const randomIndex = Math.floor(Math.random() * (times.length - 1));
    return times[randomIndex].text || '';
} 

export async function getGeneratedSentance(minutes: number, userName: string = 'unknown', formalMeeting = false) {
    const [intro, subject, action, object, time] = await Promise.all([
        getIntro(formalMeeting),
        getSubject(formalMeeting),
        getAction(formalMeeting),
        getObject(formalMeeting),
        getTime(formalMeeting)
    ]);

    const sentance: string = `${intro} ${subject} ${action} ${object} ${time} ${minutes || 'some amount of'} minutes! // _${userName}_` 

    const data: GeneratedSentanceData = {
        text: sentance,
        searchQuery: object
    };

    return data;
}