import { CustomButton } from '@/components/Buttons';
import Image from 'next/image';
import React from 'react'

const Settings = () => {
  return (
    <>
      <div className="mb-4 space-y-2">
        <p className="text-base font-bold text-ajo_offWhite text-opacity-60">
          Savings Settings
        </p>
        {/* <p className="text-sm text-ajo_offWhite">
          Savings settings
        </p> */}
      </div>
      <div>
        <Image
          src="/receive-money.svg"
          alt="hand with coins in it"
          width={120}
          height={120}
        />
        <p className="text-ajo_offWhite">
          Create a savings group make all the necessary edits and changes. Use
          the button below to get started!
        </p>
        <CustomButton
          type="button"
          label="Savings SetUp"
          style="rounded-md bg-ajo_blue py-3 px-9 text-sm text-ajo_offWhite  hover:bg-indigo-500 focus:bg-indigo-500 md:w-[60%]"
          // onButtonClick={onSubmitHandler}
        />
      </div>
    </>
  );
}

export default Settings