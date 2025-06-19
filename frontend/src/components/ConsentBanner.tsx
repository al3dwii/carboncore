'use client';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
export default function Consent() {
  const [open,set]=useState(false);
  useEffect(()=>{ if(localStorage.getItem('cc.consent')!== 'yes') set(true) },[]);
  return (
    <Dialog open={open}>
      <DialogContent>
        We use cookies for anonymised analytics.
        <button onClick={()=>{localStorage.setItem('cc.consent','yes'); set(false);}}>
          Accept
        </button>
      </DialogContent>
    </Dialog>
  );
}
