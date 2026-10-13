
/*
 * PB1-LQ1: RSA Encryption and Decryption
 * Uses JSEncrypt and the key size specified in the HTML body.
 * Each field is encrypted separately to respect RSA message limits.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Read the required RSA key size from the HTML page.
    const keySize = Number(document.body.dataset.keySize);

    // Get the form and output areas.
    const signupForm = document.getElementById("signupForm");
    const encryptedOutput = document.getElementById("encryptedOutput");
    const decryptedOutput = document.getElementById("decryptedOutput");
    const publicKeyOutput = document.getElementById("publicKeyOutput");
    const privateKeyOutput = document.getElementById("privateKeyOutput");

    // Check that the selected key size is supported by this activity.
    if (![1024, 3072].includes(keySize)) {
        encryptedOutput.textContent = "Invalid RSA key size.";
        return;
    }

    // Listen for the signup form submission.
    signupForm.addEventListener("submit", function (event) {
        // Keep the form on the same page.
        event.preventDefault();

        encryptedOutput.textContent = "Generating RSA keys...";
        decryptedOutput.textContent = "Please wait...";

        // Generate a new RSA public/private key pair.
        // Key generation can take a few seconds, especially at 3072 bits.
        try {
            const rsa = new JSEncrypt({
                default_key_size: String(keySize)
            });

            rsa.getKey();

            // Collect the form values.
            // Use fictional details for this classroom demonstration.
            const formData = {
                "Full Name": document.getElementById("fullName").value,
                "Date of Birth": document.getElementById("dob").value,
                "Year Level": document.getElementById("yearLevel").value,
                "Gender": document.getElementById("gender").value,
                "Username": document.getElementById("username").value,
                "Password": document.getElementById("password").value
            };

            const encryptedData = {};
            const decryptedData = {};

            // Encrypt and then decrypt each field individually.
            for (const field in formData) {
                const originalValue = formData[field];

                // Encrypt with the public key.
                const encryptedValue = rsa.encrypt(originalValue);

                if (encryptedValue === false) {
                    throw new Error(
                        "Could not encrypt " + field +
                        ". Please use shorter text."
                    );
                }

                encryptedData[field] = encryptedValue;

                // Decrypt with the private key.
                const decryptedValue = rsa.decrypt(encryptedValue);

                if (decryptedValue === false) {
                    throw new Error("Could not decrypt " + field + ".");
                }

                decryptedData[field] = decryptedValue;
            }

            // Display the encrypted values.
            encryptedOutput.textContent =
                "RSA KEY SIZE: " + keySize + "-bit\n\n" +
                JSON.stringify(encryptedData, null, 2);

            // Display the decrypted values for comparison.
            decryptedOutput.textContent =
                "RSA KEY SIZE: " + keySize + "-bit\n\n" +
                JSON.stringify(decryptedData, null, 2);

            // Display the demonstration keys.
            publicKeyOutput.textContent = rsa.getPublicKey();
            privateKeyOutput.textContent = rsa.getPrivateKey();

        } catch (error) {
            encryptedOutput.textContent =
                "Error: " + error.message +
                "\nPlease try again or use shorter field values.";

            decryptedOutput.textContent =
                "Decryption could not be completed.";
        }
    });
});
