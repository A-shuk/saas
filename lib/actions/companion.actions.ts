'use server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '../supabase';

/**
 * Creates a new learning companion with the given form data.
 * @param formData The form data of the companion to be created.
 * @returns The created companion.
 * @throws {Error} If the creation fails.
 */
export const createCompanion = async(formData: CreateCompanion) => {
    const {userId: author} = await auth(); // get user id from clerk
    const supabase = createSupabaseClient(); // create supabase client

    // insert companion into supabase
    const { data, error} = await supabase.from('companions').insert({... formData, author}).select()

    if (error || !data) {

        throw new Error(error?.message || 'Failed to create companion');


    }

    return data[0];
}

//fetch companions to companion library pg action:

/**
 * Fetches a list of companions from the database.
 * @param {GetAllCompanions} params - The parameters to filter the companions.
 * @param {number} [params.limit=10] - The number of companions to fetch per page.
 * @param {number} [params.page=1] - The page number to fetch.
 * @param {string} [params.subject] - The subject to filter by.
 * @param {string} [params.topic] - The topic to filter by.
 * @returns {Promise<Companion[]>} A promise that resolves with an array of companions.
 * @throws {Error} If the fetch fails.
 */
export const getAllCompanions = async({limit = 10, page = 1, subject, topic}: GetAllCompanions ) => {
    const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)

    let query = supabase.from('companions').select();
    // subject AND topic
  if (subject && topic) {
    query = query
      .ilike('subject', `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  // subject only
  else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  }

  // topic only
  else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  

    query = query.range((page - 1) * limit, page * limit - 1);
    //fetch data from db

    const {data: companions, error} = await query;

    if (error || !companions) {
        throw new Error(error?.message || 'Failed to fetch companions');
    }

    return companions; //return companions


}


/**
 * Fetches a single companion from the database by its ID.
 * @param {string} id - The ID of the companion to fetch.
 * @returns {Promise<Companion | null>} A promise that resolves with the fetched companion or null if the fetch fails.
 * @throws {Error} If the fetch fails.
 */
export const getCompanion = async(id:string) => {
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('companions').select().eq('id', id).single(); //fetch data from db

  // if erorr, display message, otherwise return data
  
  if(error) {
    return console.log(error);
  }
  return data;
}

/**
 * Adds a companion to the session history.
 * @param {string} companionId - The ID of the companion to add.
 * @returns {Promise<SessionHistory>} A promise that resolves with the added session history.
 * @throws {Error} If the addition fails.
 */
export const addToSessionHistory = async (companionId: string) => {
  const {userId} = await auth(); // get user id from clerk
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('session_history').insert({companion_id: companionId, user_id: userId}) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }
  return data;


}

/**
 * Fetches the recent sessions from the database.
 * @param {number} [limit=10] - The number of sessions to fetch.
 * @returns {Promise<Companion[]>} A promise that resolves with an array of the recent sessions.
 * @throws {Error} If the fetch fails.
 */
export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('session_history').select(`companions:companion_id (*)`).order('created_at', {ascending:false}).limit(10) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  return data.map(({companions}) => companions);
}



/**
 * Fetches the recent sessions of a user from the database.
 * @param {string} userId - The ID of the user to fetch sessions for.
 * @param {number} [limit=10] - The number of sessions to fetch.
 * @returns {Promise<Companion[]>} A promise that resolves with an array of the recent sessions of the user.
 * @throws {Error} If the fetch fails.
 */
export const getUserSessions = async (userId:string, limit = 10) => {
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('session_history').select(`companions:companion_id (*)`).eq('user_id', userId).order('created_at', {ascending:false}).limit(10) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  return data.map(({companions}) => companions);
}