import React, { use, useState, useEffect } from 'react'
import { Cards, FormField, Loader } from '../Components'

const RenderCards = ({ data, title }) => {
    if (data.length > 0) {
        return data.map((post) => <Cards key={post._id} {...post} />)
    }
    return (
        <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>
    )
}
function Home() {
    const [loading, setloading] = useState(false)
    const [allPosts, setallPosts] = useState('')
    const [searchText, setsearchText] = useState('')
    const [searchResult, setSearchResult] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            setloading(true)
            try {
                const response = await fetch('http://localhost:8080/api/v1/post', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    const result = await response.json()
                    setallPosts(result.data.reverse())
                }
            } catch (error) {
                alert(error)
            } finally {
                setloading(false)
            }
        }
        fetchPost()
    }, [])

    const handleSearchChange = (e) => {
        const value = e.target.value;
        clearTimeout(searchTimeout);
        setsearchText(value);

        setSearchTimeout(
            setTimeout(() => {
                const searchResult = allPosts.filter((post) =>
                    post.name.toLowerCase().includes(value.toLowerCase()) ||
                    post.prompt.toLowerCase().includes(value.toLowerCase())
                );
                setSearchResult(searchResult);
            }, 500)
        );
    };



    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='text-black text-3xl font-bold'>
                    The Community Showcase
                </h1>
                <p className='text-shadow-gray-500 text-[14px] max-w-[800px] mt-2'> Explore a vibrant gallery of AI-generated artwork created by the innovative DALL-E model. Imagine Create and enjoy the fun</p>
            </div>
            <div className='mt-16'>
                <FormField
                    type="text"
                    label="Search Post"
                    name="text"
                    placeholder="Search posts"
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>
            <div className='mt-10'>
                {loading ? (
                    <div className='flex justify-center items-center'> <Loader /></div>
                ) :
                    <>
                        {searchText && (
                            <h2 className='text-gray-500 font-medium text-xl mb-3 '>Showing result for:  <span className='text-black'> {searchText}</span></h2>
                        )}
                    </>}
                <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 '>
                    {searchText ? (
                        <RenderCards data={searchResult} title="No search result found" />
                    ) :
                        (
                            <RenderCards data={allPosts} title="No posts found" />
                        )
                    }
                </div>
            </div>

        </section>
    )
}

export default Home