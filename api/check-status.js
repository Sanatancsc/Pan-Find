export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    try {
        const { uid } = req.body;

        // Validation: Check ki 12-digit number hi ho
        if (!uid || !/^[0-9]{12}$/.test(uid)) {
            return res.status(400).json({ status: "error", message: "Kripya sahi 12-digit number enter karein." });
        }

        // Vercel dashboard se key apne aap yahan load hogi
        const apiKey = process.env.FINDAPI_KEY;
        if (!apiKey) {
            return res.status(500).json({ status: "error", message: "Backend configuration error (Missing API Key)." });
        }

        const apiUrl = `https://findapi.in/api/findpanstatus?api_key=${apiKey}&uid=${uid}`;

        // External API Call
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        // API Documentation ke mutabik check: status === true
        if (data && data.status === true) {
            return res.status(200).json({
                status: "success",
                message: data.msg || "Record Found",
                records: data.data || [] // Pura data array frontend ko bhej rahe hain
            });
        } else {
            return res.status(200).json({
                status: "error",
                message: data.msg || "Invalid Number ya koi record nahi mila."
            });
        }

    } catch (error) {
        console.error("Serverless Function Error:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error ya Gateway Timeout." });
    }
}
