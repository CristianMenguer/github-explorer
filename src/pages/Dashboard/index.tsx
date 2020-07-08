import React, { useState, useEffect, FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import logoImg from '../../assets/logo.svg'
import { Title, Form, Repositories, Error } from './styles'

interface Repository {
    full_name: string
    description: string
    owner: {
        login: string
        avatar_url: string
    }
}

const Dashboard: React.FC = () => {

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@github-explorer:repositories')

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories)
        } else {
            return []
        }
    })
    const [inputRepo, setInputRepo] = useState('')
    const [inputError, setInputError] = useState('')

    useEffect(() => {
        localStorage.setItem('@github-explorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {

        event.preventDefault()

        if (!inputRepo) {
            setInputError('Please type author/repository name in order to add!')
            return
        }

        try {

            const response = await api.get<Repository>(`repos/${inputRepo}`)

            setInputRepo('')

            const repository = response.data

            setRepositories([...repositories, repository])
            setInputError('')
        } catch (err) {
            setInputError('Repository not found!')
        }

    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore Repositories on Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository} >
                <input
                    placeholder="Type the name of the repository"
                    value={inputRepo}
                    onChange={e => setInputRepo(e.target.value)}
                />
                <button type="submit" >Search</button>
            </Form>

            { inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link to={`/repository/${repository.full_name}`} key={repository.full_name} >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}

            </Repositories>
        </>
    )
}

export default Dashboard
