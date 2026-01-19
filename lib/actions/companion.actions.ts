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