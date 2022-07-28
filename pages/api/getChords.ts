import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const getChords = async (req: NextApiRequest, res: NextApiResponse) => { 
    const dataDirectory = path.join(process.cwd(), 'data');

    const data = await fs.readFile(dataDirectory + '/chords.json', 'utf8');

    res.status(200).send(data);
}

export default getChords;