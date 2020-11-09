import { CMS_NAME, CMS_URL } from '../lib/constants'
import Image from 'next/image'

export default function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        Glasgow European Society
      </h1>
      <div className="mt-8 md:mt-0">
        <Image
          src="/assets/eu.png"
          alt="European Union"
          width={50}
          height={50}
        />
      </div>
      {/* <h4 className="text-center md:text-left text-lg mt-5 md:pl-8"> */}
        {/* A statically generated blog example using{' '}
        <a
          href="https://nextjs.org/"
          className="underline hover:text-success duration-200 transition-colors"
        >
          Next.js
        </a>{' '}
        and{' '}
        <a
          href={CMS_URL}
          className="underline hover:text-success duration-200 transition-colors"
        >
          {CMS_NAME}
        </a>
        . */}

      {/* </h4> */}
    </section>
  )
}
