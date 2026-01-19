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