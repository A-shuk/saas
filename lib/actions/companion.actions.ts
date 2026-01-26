'use server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '../supabase';
import { revalidatePath } from 'next/cache';

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
    const {userId} = await auth();

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
    // Get an array of companion IDs
  const companionIds = companions.map(({ id }) => id);

  // Get the bookmarks where user_id is the current user and companion_id is in the array of companion IDs
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select()
    .eq("user_id", userId)
    .in("companion_id", companionIds); // Notice the in() function used to filter the bookmarks by array

  const marks = new Set(bookmarks?.map(({ companion_id }) => companion_id));

  // Add a bookmarked property to each companion
  companions.forEach((companion) => {
    companion.bookmarked = marks.has(companion.id);
  });

    



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


/**
 * Fetches all the companions of a user from the database.
 * @param {string} userId - The ID of the user to fetch companions for.
 * @returns {Promise<Companion[]>} A promise that resolves with an array of the user's companions.
 * @throws {Error} If the fetch fails.
 */
export const getUserCompanions = async (userId:string) => {
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('companions').select().eq('author', userId) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Checks if a user has permission to create a new companion.
 * @returns {Promise<boolean>} A promise that resolves with true if the user has permission to create a new companion, false otherwise.
 * @throws {Error} If the check fails.
 */
export const newCompanionPermissions = async () => {
  const {userId, has} = await auth();
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  let limit = 0;

  if (has({plan: 'pro'})) {
    return true;

  } else if(has({feature: "3_companion_limit"})) {
    limit = 3;
  } else if(has({feature: "10_companion_limit"})) {
    limit = 10;
  } 

  const {data, error} = await supabase.from('companions').select('id', {count: 'exact'}).eq('author', userId) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }
  const companionCount = data.length;
  
  // if companion count is greater than or equal to limit, return false
  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }

}

// Bookmarks

/**
 * Fetches the bookmarks of a user from the database.
 * @param {string} userId - The ID of the user to fetch bookmarks for.
 * @returns {Promise<Companion[]>} A promise that resolves with an array of the bookmarks of the user.
 * @throws {Error} If the fetch fails.
 */
export const getUserBookmarks = async (userId:string) => {
  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('bookmarks').select(`companions:companion_id (*)`).eq('user_id', userId) //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  // We don't need the bookmarks data, so we return only the companions

  return data.map(({companions}) => companions);
}


/**
 * Adds a bookmark to the database.
 * @param {string} companionId - The ID of the companion to add a bookmark for.
 * @param {string} path - The path of the page to revalidate after adding the bookmark.
 * @returns {Promise<Companion>} A promise that resolves with the added bookmark.
 * @throws {Error} If the add fails.
 */
export const addBookmark = async(companionId: string, path: string) => {
  const {userId} = await auth(); // get user id from clerk

  if (!userId) {
    return;
  }

  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('bookmarks').insert({companion_id: companionId, user_id: userId}); //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path); //revalidate the path to force a re-render of the page
  return data;

  
}

/**
 * Removes a bookmark from the database.
 * @param {string} companionId - The ID of the companion to remove a bookmark for.
 * @param {string} path - The path of the page to revalidate after removing the bookmark.
 * @returns {Promise<Companion>} A promise that resolves with the removed bookmark.
 * @throws {Error} If the remove fails.
 */
export const removeBoookmark = async(companionId: string, path: string) => {
  const {userId} = await auth(); // get user id from clerk

  if (!userId) {
    return;
  }

  const supabase = createSupabaseClient(); // create supabase client (fetch from supabase)
  const {data, error} = await supabase.from('bookmarks').delete().eq('companion_id', companionId).eq('user_id', userId); //fetch data from db

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path); //revalidate the path to force a re-render of the page
  return data;
  


}
  


