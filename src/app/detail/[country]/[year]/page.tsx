import axios from "axios";
import Link from "next/link";

export default async function Detail(props:any) {

  const country= props.params.country;
  const year = props.params.year;
  const resp = await axios(`http://3.37.123.46/disasters/archive/${country}/${year}`)
  const DetailData = resp.data;
  console.log(DetailData);

  return (
    <>
      <div className=' flex flex-col items-center h-[90vh] text-white'>
        {DetailData.map((data:any) => {
          return (
          <>
            <h1>디테일 페이지</h1>
            <p>{data.dCountry}</p>
            <p>{data.dData}</p>
            <p>{data.dId}</p>
            <p>{data.dStatus}</p>
            <p>{data.dType}</p>
            <p>{data.dDescription}</p>
            <Link href={`${data.dUrl}`}>링크</Link>
          </>)
        })}
      </div>
    </>
  )
}