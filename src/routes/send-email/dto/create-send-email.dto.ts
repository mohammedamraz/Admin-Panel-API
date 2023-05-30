export class CreateSendEmailDto {}


export const format_mobilesave=(pdf , mobile , time)=>{
    let data=
    {
    pdf_location : pdf ? pdf : null,
    mobile : mobile ? mobile : null,
    test_time : time ? time  : null,
}

    return data
    
}